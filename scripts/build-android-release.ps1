$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$junctionPath = Join-Path $env:USERPROFILE "labour-rights-android-build"
$signingProperties = Join-Path $projectRoot "android\signing.properties"
$releaseKeystore = Join-Path $projectRoot "android\keystore\labour-rights-release.jks"

if (-not (Test-Path -LiteralPath $signingProperties)) {
    throw "The release signing properties file is missing."
}

if (-not (Test-Path -LiteralPath $releaseKeystore)) {
    throw "The release keystore is missing."
}

Push-Location $projectRoot
try {
    & npm.cmd run android:sync
    if ($LASTEXITCODE -ne 0) {
        throw "Android web synchronization failed."
    }

    $javaExecutable = (Get-Command java.exe -ErrorAction Stop).Source
    $env:JAVA_HOME = Split-Path -Parent (Split-Path -Parent $javaExecutable)

    if (Test-Path -LiteralPath $junctionPath) {
        $junction = Get-Item -LiteralPath $junctionPath -Force
        $resolvedTarget = [string]$junction.Target
        if ($resolvedTarget -ne $projectRoot) {
            throw "The build junction already points to another location: $resolvedTarget"
        }
    }
    else {
        New-Item -ItemType Junction -Path $junctionPath -Target $projectRoot | Out-Null
    }

    $androidRoot = Join-Path $junctionPath "android"
    Push-Location $androidRoot
    try {
        & .\gradlew.bat assembleRelease
        if ($LASTEXITCODE -ne 0) {
            throw "Android release build failed."
        }
    }
    finally {
        Pop-Location
    }

    $sourceApk = Join-Path $projectRoot "android\app\build\outputs\apk\release\app-release.apk"
    $distDirectory = Join-Path $projectRoot "dist"
    $destinationApk = Join-Path $distDirectory "labour-rights-calculator-v1.1.0.apk"

    New-Item -ItemType Directory -Path $distDirectory -Force | Out-Null
    Copy-Item -LiteralPath $sourceApk -Destination $destinationApk -Force
    Write-Output "Release APK created: $destinationApk"
}
finally {
    Pop-Location
}
