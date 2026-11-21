$ErrorActionPreference = 'Stop'
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    # Ventana visible solo durante la configuracion: el usuario introduce el token.
    Start-Process powershell.exe -Verb RunAs -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $PSCommandPath + '"')) -Wait
    exit
}
try {
    $root = Split-Path $PSScriptRoot -Parent
    $binary = Join-Path $root 'tools\cloudflared\cloudflared.exe'
    if (-not (Test-Path $binary)) { throw 'No se encontro el conector tools\cloudflared\cloudflared.exe.' }
    $existing = Get-Service cloudflared -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host 'Ya existe un servicio cloudflared. No se reemplaza para conservar sus tuneles.'
        Read-Host 'Pulsa Enter para salir'
        exit
    }
    Write-Host 'En Cloudflare crea el tunel DRAXEN-PC y selecciona Windows / 64 bits.'
    Write-Host 'Copia SOLO el token del comando service install. No pegues el comando completo.'
    $secure = Read-Host 'Token del tunel (entrada oculta)' -AsSecureString
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        $token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer).Trim()
        if ($token -notmatch '^[A-Za-z0-9_+/=-]{40,}$') { throw 'Formato de token invalido. Copia solo el token.' }
        & $binary service install $token *> $null
        if ($LASTEXITCODE -ne 0) { throw 'Cloudflare no pudo instalar el servicio.' }
    } finally {
        $token = $null
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
        $secure.Dispose()
    }
    Set-Service cloudflared -StartupType Automatic
    & sc.exe failure cloudflared reset= 86400 actions= restart/10000/restart/30000/restart/60000 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo configurar la recuperacion del servicio.' }
    Start-Service cloudflared
    Write-Host 'Conector instalado. Arrancara con Windows y se recuperara si falla.'
    Write-Host 'Ahora agrega en Cloudflare la ruta sigue-me.com -> HTTP -> 127.0.0.1:8080.'
} catch {
    Write-Host ('No se completo: ' + $_.Exception.Message) -ForegroundColor Red
}
Read-Host 'Pulsa Enter para cerrar'
