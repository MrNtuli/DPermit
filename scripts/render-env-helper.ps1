# Opens Render env var page and copies each value to clipboard (one key at a time).
# Run: powershell -ExecutionPolicy Bypass -File scripts\render-env-helper.ps1
# Paste into Render with Ctrl+V when prompted, then press Enter for the next key.

$envFile = Join-Path $PSScriptRoot "..\digipermit-backend\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "Missing digipermit-backend\.env" -ForegroundColor Red
    exit 1
}

$vars = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
    if ($_ -match '^([^=]+)=(.*)$') {
        $vars[$Matches[1].Trim()] = $Matches[2].Trim()
    }
}

$renderOrder = @(
    @{ Key = 'SUPABASE_URL'; Value = $vars['SUPABASE_URL'] },
    @{ Key = 'SUPABASE_ANON_KEY'; Value = $vars['SUPABASE_ANON_KEY'] },
    @{ Key = 'SUPABASE_SERVICE_ROLE_KEY'; Value = $vars['SUPABASE_SERVICE_ROLE_KEY'] },
    @{ Key = 'NODE_ENV'; Value = 'production' },
    @{ Key = 'FRONTEND_URL'; Value = 'https://mrntuli.github.io,https://mrntuli.github.io/DPermit,http://localhost:4200' }
)

Write-Host "`nDigiPermit Render environment helper" -ForegroundColor Cyan
Write-Host "1. Open your Render service -> Environment -> Add Environment Variable"
Write-Host "2. For each item below: name = Key, value = copied to clipboard on Enter`n"

Start-Process "https://dashboard.render.com"

foreach ($item in $renderOrder) {
    if (-not $item.Value) {
        Write-Host "Skip $($item.Key) — not in .env" -ForegroundColor Yellow
        continue
    }
    Write-Host "Next variable: $($item.Key)" -ForegroundColor Green
    Read-Host "Press Enter to copy VALUE to clipboard"
    Set-Clipboard -Value $item.Value
    Write-Host "  Copied. Paste into Render VALUE field, save, then repeat.`n"
}

Write-Host "Done. Redeploy if needed, then test: https://YOUR-SERVICE.onrender.com/api/health" -ForegroundColor Cyan
