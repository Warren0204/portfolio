# Screenshots a URL at a true device viewport by driving Chrome over the
# DevTools protocol. --window-size cannot go below ~484px on Windows, so
# Emulation.setDeviceMetricsOverride is the only way to see a real phone width.
param(
  [string]$Url = 'http://localhost:5173/',
  [int]$Width = 390,
  [int]$Height = 844,
  [double]$Scale = 3,
  [switch]$Mobile,
  [string]$Out = 'C:\_Temp\claude\shots\shot.png',
  [int]$Port = 9222,
  [int]$SettleMs = 3000,
  [switch]$FullPage
)

$ErrorActionPreference = 'Stop'
$ct = [System.Threading.CancellationToken]::None

$targets = Invoke-RestMethod "http://127.0.0.1:$Port/json/list"
$page = $targets | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
if (-not $page) { throw "no page target on port $Port" }

$ws = New-Object System.Net.WebSockets.ClientWebSocket
$ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).Wait()

$script:nextId = 0
function Invoke-Cdp([string]$Method, $Params) {
  $script:nextId++
  $id = $script:nextId
  $msg = @{ id = $id; method = $Method }
  if ($Params) { $msg['params'] = $Params }
  $json = $msg | ConvertTo-Json -Depth 12 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $seg = New-Object 'System.ArraySegment[byte]' (, $bytes)
  $ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).Wait()

  $buf = New-Object byte[] 262144
  while ($true) {
    $sb = New-Object System.Text.StringBuilder
    do {
      $seg2 = New-Object 'System.ArraySegment[byte]' (, $buf)
      $task = $ws.ReceiveAsync($seg2, $ct)
      $task.Wait()
      [void]$sb.Append([System.Text.Encoding]::UTF8.GetString($buf, 0, $task.Result.Count))
    } while (-not $task.Result.EndOfMessage)

    $obj = $sb.ToString() | ConvertFrom-Json
    if ($obj.PSObject.Properties.Name -contains 'id' -and $obj.id -eq $id) { return $obj }
  }
}

Invoke-Cdp 'Page.enable' $null | Out-Null
Invoke-Cdp 'Emulation.setDeviceMetricsOverride' @{
  width             = $Width
  height            = $Height
  deviceScaleFactor = $Scale
  mobile            = [bool]$Mobile
} | Out-Null

Invoke-Cdp 'Page.navigate' @{ url = $Url } | Out-Null
Start-Sleep -Milliseconds $SettleMs

$shotParams = @{ format = 'png' }
if ($FullPage) { $shotParams['captureBeyondViewport'] = $true }
$shot = Invoke-Cdp 'Page.captureScreenshot' $shotParams

$dir = Split-Path $Out -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
[System.IO.File]::WriteAllBytes($Out, [Convert]::FromBase64String($shot.result.data))

$metrics = Invoke-Cdp 'Runtime.evaluate' @{
  expression    = "document.documentElement.clientWidth + 'x' + document.documentElement.clientHeight + ' dpr' + window.devicePixelRatio"
  returnByValue = $true
}
Write-Output ("{0}  ->  viewport {1}" -f $Out, $metrics.result.result.value)

$ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, 'done', $ct).Wait()
