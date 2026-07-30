$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$androidRoot = Join-Path $projectRoot "android"
$keystoreDirectory = Join-Path $androidRoot "keystore"
$keystorePath = Join-Path $keystoreDirectory "labour-rights-release.jks"
$propertiesPath = Join-Path $androidRoot "signing.properties"
$junctionPath = Join-Path $env:USERPROFILE "labour-rights-android-build"

if ((Test-Path -LiteralPath $keystorePath) -and (Test-Path -LiteralPath $propertiesPath)) {
    Write-Output "The existing release-signing files will be reused."
    exit 0
}

if ((Test-Path -LiteralPath $keystorePath) -or (Test-Path -LiteralPath $propertiesPath)) {
    throw "Release-signing files are incomplete. Restore the matching keystore and properties file before continuing."
}

$passwordBytes = New-Object byte[] 32
$randomGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $randomGenerator.GetBytes($passwordBytes)
}
finally {
    $randomGenerator.Dispose()
}

$password = [Convert]::ToBase64String($passwordBytes).Replace("+", "A").Replace("/", "B").TrimEnd("=")
$javaExecutable = (Get-Command java.exe -ErrorAction Stop).Source
$javaHome = Split-Path -Parent (Split-Path -Parent $javaExecutable)
$keytool = Join-Path $javaHome "bin\keytool.exe"

New-Item -ItemType Directory -Path $keystoreDirectory -Force | Out-Null

if (Test-Path -LiteralPath $junctionPath) {
    $junction = Get-Item -LiteralPath $junctionPath -Force
    $resolvedTarget = [string]$junction.Target
    if ($resolvedTarget -ne $projectRoot) {
        throw "The signing junction already points to another location: $resolvedTarget"
    }
}
else {
    New-Item -ItemType Junction -Path $junctionPath -Target $projectRoot | Out-Null
}

$keytoolKeystorePath = Join-Path $junctionPath "android\keystore\labour-rights-release.jks"

& $keytool `
    -genkeypair `
    -v `
    -keystore $keytoolKeystorePath `
    -alias "labour-rights" `
    -keyalg RSA `
    -keysize 4096 `
    -validity 10000 `
    -storepass $password `
    -keypass $password `
    -dname "CN=Mohammad Al-Shouha, OU=Labour Rights Calculator, O=Mohammad Al-Shouha, L=Amman, ST=Amman, C=JO" `
    -noprompt

if ($LASTEXITCODE -ne 0) {
    throw "Release keystore generation failed."
}

$properties = @(
    "storeFile=keystore/labour-rights-release.jks"
    "storePassword=$password"
    "keyAlias=labour-rights"
    "keyPassword=$password"
) -join [Environment]::NewLine

[System.IO.File]::WriteAllText(
    $propertiesPath,
    $properties + [Environment]::NewLine,
    (New-Object System.Text.UTF8Encoding($false))
)

Write-Output "Release-signing files were created locally."
Write-Output "Back up the android\keystore folder and android\signing.properties together."
