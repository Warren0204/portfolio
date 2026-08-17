# Unpacks reference/prototype.html — a self-contained bundle whose assets ride
# along as gzipped base64 in a manifest script tag — back into readable source
# plus real files, so the prototype can be diffed and its images promoted into
# assets/. Regenerates output that is git-ignored; safe to re-run.
param(
  [string]$Source = (Join-Path $PSScriptRoot 'prototype.html'),
  [string]$OutDir = (Join-Path $PSScriptRoot 'extracted')
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

$lines = [System.IO.File]::ReadAllLines($Source)

function Get-TagPayload([string[]]$all, [string]$tagType) {
  $start = -1
  for ($i = 0; $i -lt $all.Length; $i++) {
    if ($all[$i] -match [regex]::Escape("<script type=`"__bundler/$tagType`">")) { $start = $i + 1; break }
  }
  if ($start -lt 0) { throw "tag $tagType not found" }
  $buf = New-Object System.Text.StringBuilder
  for ($j = $start; $j -lt $all.Length; $j++) {
    if ($all[$j] -match '^\s*</script>\s*$') { break }
    [void]$buf.Append($all[$j])
  }
  return $buf.ToString()
}

$manifestRaw = Get-TagPayload $lines 'manifest'
$extRaw      = Get-TagPayload $lines 'ext_resources'
$templateRaw = Get-TagPayload $lines 'template'

Write-Output ("manifest chars: " + $manifestRaw.Length)
Write-Output ("ext chars:      " + $extRaw.Length)
Write-Output ("template chars: " + $templateRaw.Length)

# ext_resources is small -> safe to parse as JSON
$extList = $extRaw | ConvertFrom-Json
$idByUuid = @{}
foreach ($e in $extList) { $idByUuid[$e.uuid] = $e.id }

# Manifest is multi-MB; regex-scan it instead of ConvertFrom-Json (PS 5.1 limits).
$entryRx = [regex]'"([0-9a-fA-F-]{36})":\{"mime":"([^"]+)","compressed":(true|false),"data":"([^"]*)"\}'
$matches = $entryRx.Matches($manifestRaw)
Write-Output ("assets found:   " + $matches.Count)

$extByMime = @{
  'image/png'       = 'png'
  'image/jpeg'      = 'jpg'
  'image/jpg'       = 'jpg'
  'image/gif'       = 'gif'
  'image/webp'      = 'webp'
  'image/svg+xml'   = 'svg'
  'text/javascript' = 'js'
  'application/javascript' = 'js'
  'text/css'        = 'css'
  'text/html'       = 'html'
  'application/pdf' = 'pdf'
  'font/woff2'      = 'woff2'
  'font/woff'       = 'woff'
}

function Expand-Gzip([byte[]]$bytes) {
  $inStream  = New-Object System.IO.MemoryStream(,$bytes)
  $gz        = New-Object System.IO.Compression.GZipStream($inStream, [System.IO.Compression.CompressionMode]::Decompress)
  $outStream = New-Object System.IO.MemoryStream
  $gz.CopyTo($outStream)
  $gz.Dispose(); $inStream.Dispose()
  $result = $outStream.ToArray()
  $outStream.Dispose()
  return $result
}

$pathByUuid = @{}
$report = New-Object System.Collections.ArrayList

foreach ($m in $matches) {
  $uuid       = $m.Groups[1].Value
  $mime       = $m.Groups[2].Value
  $compressed = $m.Groups[3].Value -eq 'true'
  $b64        = $m.Groups[4].Value

  $bytes = [Convert]::FromBase64String($b64)
  if ($compressed) { $bytes = Expand-Gzip $bytes }

  $ext = $extByMime[$mime]
  if (-not $ext) { $ext = 'bin' }

  $name = $idByUuid[$uuid]
  if (-not $name) { $name = $uuid }
  $name = [regex]::Replace($name, '[^A-Za-z0-9._-]', '-')
  $fileName = "$name.$ext"
  $full = Join-Path $OutDir $fileName
  [System.IO.File]::WriteAllBytes($full, $bytes)

  $pathByUuid[$uuid] = "extracted/$fileName"
  [void]$report.Add([pscustomobject]@{ id = $name; mime = $mime; bytes = $bytes.Length; file = $fileName })
}

# Template is a JSON-encoded string. Unwrap via .NET serializer with a raised cap.
Add-Type -AssemblyName System.Web.Extensions
$ser = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$ser.MaxJsonLength = [int]::MaxValue
$templateHtml = $ser.DeserializeObject($templateRaw)

foreach ($uuid in $pathByUuid.Keys) {
  $templateHtml = $templateHtml.Replace($uuid, $pathByUuid[$uuid])
}

$decodedPath = Join-Path (Split-Path $OutDir -Parent) 'prototype.decoded.html'
[System.IO.File]::WriteAllText($decodedPath, $templateHtml, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ("decoded html:   " + $templateHtml.Length + " chars -> " + $decodedPath)

$report | Sort-Object bytes -Descending | Format-Table -AutoSize | Out-String -Width 160
