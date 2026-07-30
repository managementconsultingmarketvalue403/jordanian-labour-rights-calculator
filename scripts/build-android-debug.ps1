$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$junctionPath = Join-Path $env:USERPROFILE "labour-rights-android-build"

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
        & .\gradlew.bat assembleDebug
        if ($LASTEXITCODE -ne 0) {
            throw "Android build failed."
        }
    }
    finally {
        Pop-Location
    }

    $sourceApk = Join-Path $projectRoot "android\app\build\outputs\apk\debug\app-debug.apk"
    $distDirectory = Join-Path $projectRoot "dist"
    $destinationApk = Join-Path $distDirectory "labour-rights-calculator-v1.1.0-beta.1.apk"

    New-Item -ItemType Directory -Path $distDirectory -Force | Out-Null
    Copy-Item -LiteralPath $sourceApk -Destination $destinationApk -Force
    Write-Output "APK created: $destinationApk"
}
finally {
    Pop-Location
}
