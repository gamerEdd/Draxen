$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$binary = Join-Path $root 'tools\cloudflared\cloudflared.exe'
$config = Join-Path $root 'tools\cloudflared\draxen.yml'
$mutex = New-Object Threading.Mutex($false, 'Local\DraxenSigueMeTunnel')
if (-not $mutex.WaitOne(0)) { exit }
$connector = $null
try {
    while ($true) {
        $connector = Start-Process -FilePath $binary -ArgumentList @('tunnel', '--config', ('"' + $config + '"'), '--logfile', ('"' + (Join-Path $root 'tools\cloudflared\sigue-me.log') + '"'), 'run', 'SIGUE-ME-PC') -WindowStyle Hidden -PassThru -WorkingDirectory $root
        $connector.WaitForExit()
        Start-Sleep -Seconds 10
    }
} finally {
    if ($connector -and -not $connector.HasExited) { Stop-Process -Id $connector.Id -ErrorAction SilentlyContinue }
    $mutex.ReleaseMutex()
    $mutex.Dispose()
}
