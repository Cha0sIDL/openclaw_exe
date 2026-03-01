$env:PATH = 'D:\nodejs;' + $env:PATH
Write-Host "Installing pnpm globally..."
& "D:\nodejs\npm.cmd" install -g pnpm@10
if ($LASTEXITCODE -ne 0) { throw "npm install -g pnpm failed" }
Write-Host "pnpm version:"
pnpm --version
