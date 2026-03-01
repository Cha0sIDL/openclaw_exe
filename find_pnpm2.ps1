$dirs = @(
    "C:\Users\Administrator\AppData\Local\pnpm",
    "C:\Users\Administrator\AppData\Roaming\pnpm",
    "C:\Users\Administrator\AppData\Local\npm",
    "D:\nodejs",
    "C:\ProgramData\chocolatey\bin"
)
foreach ($d in $dirs) {
    if (Test-Path $d) {
        Get-ChildItem $d -Filter "pnpm*" -ErrorAction SilentlyContinue | Select-Object FullName
    }
}
