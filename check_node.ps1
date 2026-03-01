$machinePath = [System.Environment]::GetEnvironmentVariable('PATH','Machine')
$userPath = [System.Environment]::GetEnvironmentVariable('PATH','User')
Write-Host "Machine PATH entries containing 'node':"
$machinePath -split ';' | Where-Object { $_ -match 'node|npm' } | ForEach-Object { Write-Host "  $_" }
Write-Host "User PATH entries containing 'node':"
$userPath -split ';' | Where-Object { $_ -match 'node|npm' } | ForEach-Object { Write-Host "  $_" }
Write-Host "Current session PATH 'node' entries:"
$env:PATH -split ';' | Where-Object { $_ -match 'node|npm' } | ForEach-Object { Write-Host "  $_" }
Write-Host "node.exe location:"
Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
