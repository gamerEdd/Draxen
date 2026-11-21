param(
    [string]$NodePath = 'C:\Program Files\nodejs\node.exe',
    [int]$IntervalSeconds = 30
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$stateDirectory = Join-Path $root 'backend\data\supervisor-sigue-me'
New-Item -ItemType Directory -Path $stateDirectory -Force | Out-Null
# Per-session lock also works for the ordinary user's Startup entry.
$mutex = New-Object Threading.Mutex($false, 'Local\DraxenProduccionSupervisor')
if (-not $mutex.WaitOne(0)) { exit }
$server = $null
$env:NODE_ENV = 'production'
$env:HOST = '0.0.0.0'
$env:PORT = '8080'
function Test-Store {
    try {
        $health = Invoke-WebRequest 'http://127.0.0.1:8080/health' -UseBasicParsing -TimeoutSec 5
        $storePage = Invoke-WebRequest 'http://127.0.0.1:8080/' -UseBasicParsing -TimeoutSec 5
        return ($health.StatusCode -eq 200 -and ($health.Content | ConvertFrom-Json).status -eq 'OK' -and $storePage.StatusCode -eq 200 -and $storePage.Content -match '<div\s+id="root"')
    } catch { return $false }
}
try {
    while ($true) {
        $healthy = Test-Store
        $detail = ''
        if (-not $healthy) {
            # Solo se termina el proceso creado por este supervisor.
            if ($server -and -not $server.HasExited) {
                Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
                $server.WaitForExit(5000) | Out-Null
            }
            $listener = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
            if ($listener) {
                $detail = 'Puerto ocupado por otro proceso; no se termina automaticamente.'
            } else {
                try {
                    $server = Start-Process -FilePath $NodePath -ArgumentList 'src/server.js' -WorkingDirectory (Join-Path $root 'backend') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $stateDirectory 'servidor.log') -RedirectStandardError (Join-Path $stateDirectory 'errores.log') -PassThru
                    Start-Sleep -Seconds 10
                    $healthy = Test-Store
                } catch { $detail = $_.Exception.Message }
            }
        }
        @{ activo = $healthy; comprobado = (Get-Date).ToString('o'); puerto = 8080; proceso = $(if ($server -and -not $server.HasExited) { $server.Id } else { $null }); detalle = $detail } | ConvertTo-Json | Set-Content (Join-Path $stateDirectory 'estado.json') -Encoding UTF8
        Start-Sleep -Seconds ([Math]::Max(10, $IntervalSeconds))
    }
} finally {
    if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue }
    $mutex.ReleaseMutex()
    $mutex.Dispose()
}
