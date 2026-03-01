$npmPrefix = & "D:\nodejs\npm.cmd" prefix -g 2>&1
Write-Host "npm global prefix: $npmPrefix"
if ($npmPrefix -and (Test-Path $npmPrefix)) {
    Get-ChildItem $npmPrefix -Filter "pnpm*" -ErrorAction SilentlyContinue | Select-Object FullName
}
