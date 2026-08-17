# Static file server for local development without Node installed.
# ES modules require HTTP, so index.html cannot simply be opened from disk.
# Mirrors the two things vercel.json does that matter locally: correct MIME
# types, and an index.html fallback so deep links resolve.
param(
  [int]$Port = 5173,
  [string]$Root = (Split-Path $PSScriptRoot -Parent)
)

$ErrorActionPreference = 'Stop'

$mimeTypes = @{
  '.html'        = 'text/html; charset=utf-8'
  '.css'         = 'text/css; charset=utf-8'
  '.js'          = 'text/javascript; charset=utf-8'
  '.json'        = 'application/json; charset=utf-8'
  '.webmanifest' = 'application/manifest+json; charset=utf-8'
  '.xml'         = 'application/xml; charset=utf-8'
  '.txt'         = 'text/plain; charset=utf-8'
  '.svg'         = 'image/svg+xml'
  '.png'         = 'image/png'
  '.jpg'         = 'image/jpeg'
  '.jpeg'        = 'image/jpeg'
  '.webp'        = 'image/webp'
  '.ico'         = 'image/x-icon'
  '.pdf'         = 'application/pdf'
  '.woff2'       = 'font/woff2'
}

$rootFull = [System.IO.Path]::GetFullPath($Root)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Output "Serving $rootFull at http://localhost:$Port/  (Ctrl+C to stop)"

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath).TrimStart('/')
    if ($relative -eq '') { $relative = 'index.html' }

    $candidate = [System.IO.Path]::GetFullPath((Join-Path $rootFull $relative))

    # Refuse anything that escapes the served root.
    if (-not $candidate.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
      $context.Response.StatusCode = 403
      $context.Response.Close()
      continue
    }

    if (Test-Path -LiteralPath $candidate -PathType Container) {
      $candidate = Join-Path $candidate 'index.html'
    }

    # Unknown paths fall back to the shell, matching the production rewrite.
    if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
      $candidate = Join-Path $rootFull 'index.html'
    }

    $extension = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
    $contentType = $mimeTypes[$extension]
    if (-not $contentType) { $contentType = 'application/octet-stream' }

    $bytes = [System.IO.File]::ReadAllBytes($candidate)
    $context.Response.ContentType = $contentType
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.Close()

    Write-Output ("{0} {1} -> {2}" -f $context.Request.HttpMethod, $context.Request.Url.PathAndQuery, $candidate.Substring($rootFull.Length))
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
