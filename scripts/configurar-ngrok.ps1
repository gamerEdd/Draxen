param([switch]$Configurar)
$ErrorActionPreference = 'Stop'
$ngrok = (Get-Command ngrok.exe -ErrorAction Stop).Source
if ($Configurar) {
    Write-Host 'Pega un token nuevo de ngrok. La entrada permanece oculta.'
    $secret = Read-Host 'Authtoken' -AsSecureString
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
    try {
        $token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer).Trim()
        if (-not $token) { throw 'No se introdujo un token.' }
        & $ngrok config add-authtoken $token
        if ($LASTEXITCODE -ne 0) { throw 'No se pudo guardar el token.' }
    } finally {
        $token = $null
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
        $secret.Dispose()
    }
    $taskName = 'Draxen-Ngrok'
    $action = New-ScheduledTaskAction -Execute "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe" -Argument ('-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $PSCommandPath + '"')
    $userName = [Security.Principal.WindowsIdentity]::GetCurrent().Name
    $trigger = New-ScheduledTaskTrigger -AtLogOn -User $userName
    $principal = New-ScheduledTaskPrincipal -UserId $userName -LogonType Interactive -RunLevel Limited
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) -MultipleInstances IgnoreNew -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force | Out-Null
    Start-ScheduledTask -TaskName $taskName
    Write-Host 'Configurado: el tunel arrancara al iniciar sesion en Windows.'
    Read-Host 'Pulsa Enter para cerrar'
    exit
}
$root = Split-Path $PSScriptRoot -Parent
$logDir = Join-Path $root 'backend\data\ngrok'
New-Item -ItemType Directory -Path $logDir -Force | Out-Null
& $ngrok http 8080 --log=stdout *> (Join-Path $logDir 'tunnel.log')
exit $LASTEXITCODE
