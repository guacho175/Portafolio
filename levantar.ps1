$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$HostAddress = "127.0.0.1"
$StartPort = 5500
$MaxPort = 5510

function Test-PortAvailable {
  param([int]$Port)

  $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse($HostAddress), $Port)

  try {
    $listener.Start()
    return $true
  }
  catch {
    return $false
  }
  finally {
    if ($listener.Server -and $listener.Server.IsBound) {
      $listener.Stop()
    }
  }
}

function Get-PythonCommand {
  $candidates = @("python", "py")

  foreach ($name in $candidates) {
    $command = Get-Command $name -ErrorAction SilentlyContinue
    if (-not $command) {
      continue
    }

    try {
      $version = & $command.Source --version 2>&1
      if ($LASTEXITCODE -eq 0 -and "$version" -match "Python") {
        return $command.Source
      }
    }
    catch {
      continue
    }
  }

  return $null
}

$Python = Get-PythonCommand
if (-not $Python) {
  throw "No se encontro Python. Instala Python 3 y vuelve a ejecutar este script."
}

$Port = $null
foreach ($candidate in $StartPort..$MaxPort) {
  if (Test-PortAvailable -Port $candidate) {
    $Port = $candidate
    break
  }
}

if ($null -eq $Port) {
  throw "No hay puertos libres entre $StartPort y $MaxPort."
}

$Url = "http://$HostAddress`:$Port/"

Write-Host ""
Write-Host "Levantando portafolio local..." -ForegroundColor Cyan
Write-Host "Ruta: $Root"
Write-Host "URL:  $Url"
Write-Host ""
Write-Host "Para detener el servidor, presiona Ctrl+C en esta ventana."
Write-Host ""

Start-Job -ScriptBlock {
  param([string]$TargetUrl)
  Start-Sleep -Seconds 1
  Start-Process $TargetUrl
} -ArgumentList $Url | Out-Null

Push-Location $Root
try {
  & $Python -m http.server $Port --bind $HostAddress --directory $Root
}
finally {
  Pop-Location
}
