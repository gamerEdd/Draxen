# Ejecutar en PowerShell como administrador. Solo permite dispositivos de la subred local.
$ErrorActionPreference = 'Stop'
$ruleName = 'Draxen-LAN-8080'
if (Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue) {
    Enable-NetFirewallRule -Name $ruleName
} else {
    New-NetFirewallRule -Name $ruleName -DisplayName 'DRAXEN tienda LAN TCP 8080' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8080 -RemoteAddress LocalSubnet -Profile Any | Out-Null
}
Write-Host 'Acceso local habilitado para DRAXEN en el puerto 8080.'
