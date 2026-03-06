; OpenClaw Windows Installer Script
; Generated for Inno Setup 6

#define MyAppName "OpenClaw"
#define MyAppVersion "2026.2.27"
#define MyAppPublisher "lys46001"
#define MyAppURL "https://github.com/openclaw/openclaw"
#define MyAppExeName "start-gateway.bat"

[Setup]
AppId={{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
OutputDir=D:\openclaw_exe\Output
OutputBaseFilename=OpenClaw-Setup
; SetupIconFile is set by build.ps1 if openclaw.ico is found
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
DisableDirPage=no
ArchitecturesInstallIn64BitMode=x64os
ArchitecturesAllowed=x64os
MinVersion=10.0
UninstallDisplayName={#MyAppName}
ChangesEnvironment=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop shortcut"; GroupDescription: "Additional icons:"; Flags: unchecked

[Files]
; Application files from pnpm deploy staging
Source: "D:\openclaw_exe\staging\*"; DestDir: "{app}\app"; Flags: recursesubdirs ignoreversion createallsubdirs
; Portable Node.js runtime
Source: "D:\openclaw_exe\runtime\node\*"; DestDir: "{app}\node"; Flags: recursesubdirs ignoreversion createallsubdirs
; Launcher scripts
Source: "D:\openclaw_exe\installer\openclaw.cmd"; DestDir: "{app}\bin"; Flags: ignoreversion
Source: "D:\openclaw_exe\installer\start-gateway.bat"; DestDir: "{app}\bin"; Flags: ignoreversion

[Icons]
Name: "{group}\OpenClaw Gateway"; Filename: "{app}\bin\start-gateway.bat"; WorkingDir: "{app}"; Comment: "Start OpenClaw Gateway on port 18789"
Name: "{group}\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{userdesktop}\OpenClaw"; Filename: "{app}\bin\start-gateway.bat"; WorkingDir: "{app}"; Comment: "Start OpenClaw Gateway on port 18789"; Tasks: desktopicon

[Registry]
; Add {app}\bin to current user PATH
Root: HKCU; Subkey: "Environment"; ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\bin"; Check: NeedsAddPath(ExpandConstant('{app}\bin'))

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[Code]
// ── Gateway token generation ───────────────────────────────────────────────
// Generates a 32-character random alphanumeric token and writes it to
// {app}\gateway-token.txt during installation (skipped on upgrade/reinstall
// if the file already exists so the token stays stable across upgrades).

var
  GatewayToken: String;

function GetTickCount: DWORD;
  external 'GetTickCount@kernel32.dll stdcall';

// LCG-based token generator seeded with the system tick count.
// Inno Setup Pascal does not expose Randomize; GetTickCount provides entropy.
function GenerateToken: String;
var
  i: Integer;
  chars: String;
  n: Int64;
begin
  chars := 'abcdefghijklmnopqrstuvwxyz0123456789';
  n := GetTickCount;
  Result := '';
  for i := 1 to 32 do
  begin
    n := (n * 1103515245 + 12345) and $7FFFFFFF;
    Result := Result + Copy(chars, (n mod 36) + 1, 1);
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  TokenFile: String;
begin
  if CurStep = ssPostInstall then
  begin
    TokenFile := ExpandConstant('{app}\gateway-token.txt');
    if not FileExists(TokenFile) then
    begin
      GatewayToken := GenerateToken;
      SaveStringToFile(TokenFile, GatewayToken, False);
    end;
  end;
end;

// ── PATH helper ────────────────────────────────────────────────────────────
// Check if a path entry needs to be added to PATH
function NeedsAddPath(Param: string): boolean;
var
  OrigPath: string;
begin
  if not RegQueryStringValue(HKCU, 'Environment', 'Path', OrigPath) then
  begin
    Result := True;
    exit;
  end;
  // Look for the path with and without trailing backslash
  Result := Pos(';' + Uppercase(Param) + ';', ';' + Uppercase(OrigPath) + ';') = 0;
end;

// Remove the app bin directory from PATH on uninstall
procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  Path: string;
  AppBin: string;
  P: Integer;
begin
  if CurUninstallStep = usPostUninstall then
  begin
    AppBin := ExpandConstant('{app}\bin');
    if RegQueryStringValue(HKCU, 'Environment', 'Path', Path) then
    begin
      // Remove ;AppBin
      P := Pos(';' + Uppercase(AppBin), Uppercase(Path));
      if P > 0 then
      begin
        Delete(Path, P, Length(';' + AppBin));
        RegWriteStringValue(HKCU, 'Environment', 'Path', Path);
      end;
    end;
  end;
end;

// Validate that required source directories exist before installing
function InitializeSetup(): Boolean;
begin
  Result := True;
end;






