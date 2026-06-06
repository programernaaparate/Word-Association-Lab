$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$androidDir = Join-Path $projectRoot 'android'
$apkPath = Join-Path $androidDir 'app\build\outputs\apk\debug\app-debug.apk'

function Get-JavaMajorVersion {
  param(
    [Parameter(Mandatory = $true)]
    [string]$JavaHome
  )

  $javaExe = Join-Path $JavaHome 'bin\java.exe'
  if (-not (Test-Path $javaExe)) {
    return 0
  }

  $versionOutput = & $javaExe --version 2>$null | Select-Object -First 1
  if (-not $versionOutput) {
    return 0
  }

  if ($versionOutput -match '(?<version>\d+)(\.\d+)?') {
    return [int]$Matches.version
  }

  return 0
}

function Resolve-JavaHome {
  if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    $existingMajor = Get-JavaMajorVersion -JavaHome $env:JAVA_HOME
    if ($existingMajor -ge 17 -and $existingMajor -le 21) {
      return $env:JAVA_HOME
    }
  }

  $candidateRoots = @(
    'C:\Program Files\Android\Android Studio\jbr',
    (Join-Path $env:LOCALAPPDATA 'Programs\Android Studio\jbr'),
    (Join-Path $env:LOCALAPPDATA 'Programs\Eclipse Adoptium'),
    'C:\Program Files\Eclipse Adoptium',
    'C:\Program Files\Java'
  ) | Where-Object { $_ -and (Test-Path $_) }

  $jdkCandidates = foreach ($root in $candidateRoots) {
    if (Test-Path (Join-Path $root 'bin\java.exe')) {
      Get-Item $root
      continue
    }

    Get-ChildItem $root -Directory -ErrorAction SilentlyContinue |
      Where-Object { Test-Path (Join-Path $_.FullName 'bin\java.exe') }
  }

  $resolved = $jdkCandidates |
    ForEach-Object {
      [PSCustomObject]@{
        FullName = $_.FullName
        Name = $_.Name
        MajorVersion = Get-JavaMajorVersion -JavaHome $_.FullName
      }
    } |
    Where-Object { $_.MajorVersion -ge 17 -and $_.MajorVersion -le 21 } |
    Sort-Object -Property `
      @{ Expression = 'MajorVersion'; Descending = $true }, `
      @{ Expression = 'Name'; Descending = $true } |
    Select-Object -First 1 -ExpandProperty FullName

  if (-not $resolved) {
    throw 'Podrzani JDK nije pronadjen. Instaliraj JDK 17 ili 21, ili koristi Android Studio JBR.'
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
