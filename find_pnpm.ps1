Get-ChildItem -Path "C:\","D:\","E:\","F:\" -Filter "pnpm.cmd" -Recurse -ErrorAction SilentlyContinue -Depth 6 | Select-Object FullName
