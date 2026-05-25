$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$androidDir = Join-Path $projectRoot 'android'
$apkPath = Join-Path $androidDir 'app\build\outputs\apk\debug\app-debug.apk'

function Resolve-JavaHome {
  if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    return $env:JAVA_HOME
  }

  $candidateRoots = @(
    (Join-Path $env:LOCALAPPDATA 'Programs\Eclipse Adoptium'),
    'C:\Program Files\Eclipse Adoptium',
    'C:\Program Files\Java'
  ) | Where-Object { $_ -and (Test-Path $_) }

  $jdkCandidates = foreach ($root in $candidateRoots) {
    Get-ChildItem $root -Directory -ErrorAction SilentlyContinue |
      Where-Object { Test-Path (Join-Path $_.FullName 'bin\java.exe') }
  }

  $resolved = $jdkCandidates |
    Sort-Object Name -Descending |
    Select-Object -First 1 -ExpandProperty FullName

  if (-not $resolved) {
    throw 'JDK nije pronadjen. Instaliraj Java JDK i pokusaj ponovo.'
  }

  return $resolved
}

$env:JAVA_HOME = Resolve-JavaHome
if ($env:Path -notlike "*$env:JAVA_HOME\bin*") {
  $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}

Write-Host "Koristim JAVA_HOME: $env:JAVA_HOME"

Push-Location $projectRoot
try {
  npm run mobile:sync

  Push-Location $androidDir
  try {
    .\gradlew.bat assembleDebug
  }
  finally {
    Pop-Location
  }
}
finally {
  Pop-Location
}

if (-not (Test-Path $apkPath)) {
  throw "APK nije pronadjen na putanji: $apkPath"
}

$apkItem = Get-Item $apkPath
Write-Host "APK spreman: $($apkItem.FullName)"
Write-Host "Velicina: $([Math]::Round($apkItem.Length / 1MB, 2)) MB"
