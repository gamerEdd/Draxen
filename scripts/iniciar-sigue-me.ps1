$ErrorActionPreference = 'Stop'
$nodePath = (Get-Command node.exe -ErrorAction Stop).Source
$powershell = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
Start-Process -FilePath $powershell -ArgumentList @('-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', ('"' + (Join-Path $PSScriptRoot 'supervisar-produccion.ps1') + '"'), '-NodePath', ('"' + $nodePath + '"')) -WindowStyle Hidden
Start-Process -FilePath $powershell -ArgumentList @('-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', ('"' + (Join-Path $PSScriptRoot 'supervisar-cloudflare.ps1') + '"')) -WindowStyle Hidden
