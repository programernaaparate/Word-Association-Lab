$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$androidDir = Join-Path $projectRoot 'android'
$keystoreDir = Join-Path $androidDir 'keystore'
$keystorePath = Join-Path $keystoreDir 'word-association-lab-release.jks'
$signingPropertiesPath = Join-Path $androidDir 'signing.properties'
$releaseApkPath = Join-Path $androidDir 'app\build\outputs\apk\release\app-release.apk'
$releaseAabPath = Join-Path $androidDir 'app\build\outputs\bundle\release\app-release.aab'

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

function New-RandomSecret {
  param(
    [int]$Length = 24
  )

  $allowedChars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*_-+='
  -join (1..$Length | ForEach-Object { $allowedChars[(Get-Random -Minimum 0 -Maximum $allowedChars.Length)] })
}

function Ensure-ReleaseSigning {
  if ((Test-Path $keystorePath) -and (Test-Path $signingPropertiesPath)) {
    return
  }

  New-Item -ItemType Directory -Force -Path $keystoreDir | Out-Null

  $storePassword = New-RandomSecret
  $keyPassword = $storePassword
  $keyAlias = 'word_association_lab_release'
  $keytoolExe = Join-Path $env:JAVA_HOME 'bin\keytool.exe'

  & $keytoolExe -genkeypair `
    -v `
    -keystore $keystorePath `
    -alias $keyAlias `
    -keyalg RSA `
    -keysize 2048 `
    -validity 3650 `
    -storepass $storePassword `
    -keypass $keyPassword `
    -dname 'CN=Word Association Lab, OU=Mobile, O=Word Association Lab, L=Podgorica, ST=Podgorica, C=ME' | Out-Null

  @"
storeFile=keystore/word-association-lab-release.jks
storePassword=$storePassword
keyAlias=$keyAlias
keyPassword=$keyPassword
"@ | Set-Content -Encoding ascii $signingPropertiesPath

  Write-Host 'Kreiran je novi release keystore.'
  Write-Host "Keystore: $keystorePath"
  Write-Host "Signing config: $signingPropertiesPath"
  Write-Host 'Sacuvaj storePassword i keyPassword iz android/signing.properties na bezbjedno mjesto.'
}

$env:JAVA_HOME = Resolve-JavaHome
if ($env:Path -notlike "*$env:JAVA_HOME\bin*") {
  $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}

Write-Host "Koristim JAVA_HOME: $env:JAVA_HOME"

Ensure-ReleaseSigning

Push-Location $projectRoot
try {
  npm run mobile:sync

  Push-Location $androidDir
  try {
    .\gradlew.bat assembleRelease bundleRelease
  }
  finally {
    Pop-Location
  }
}
finally {
  Pop-Location
}

if (-not (Test-Path $releaseApkPath)) {
  throw "Release APK nije pronadjen na putanji: $releaseApkPath"
}

if (-not (Test-Path $releaseAabPath)) {
  throw "Release AAB nije pronadjen na putanji: $releaseAabPath"
}

$apkItem = Get-Item $releaseApkPath
$aabItem = Get-Item $releaseAabPath

Write-Host "Release APK spreman: $($apkItem.FullName)"
Write-Host "APK velicina: $([Math]::Round($apkItem.Length / 1MB, 2)) MB"
Write-Host "Release AAB spreman: $($aabItem.FullName)"
Write-Host "AAB velicina: $([Math]::Round($aabItem.Length / 1MB, 2)) MB"
