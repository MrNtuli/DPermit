# Quick check: verify officer sees their own scans after API fix is deployed.
# Usage: powershell -File scripts\test-verification-logs.ps1

$base = if ($env:DIGIPERMIT_API) { $env:DIGIPERMIT_API } else { "https://dpermit.onrender.com/api" }

$login = Invoke-RestMethod -Uri "$base/auth/login" -Method Post `
  -Body '{"email":"verify@digipermit.demo","password":"Demo@12345"}' -ContentType "application/json"
$token = $login.data.session.access_token
$profileId = $login.data.profile.id
$headers = @{ Authorization = "Bearer $token" }

Invoke-RestMethod -Uri "$base/verify/qr" -Method Post -Headers $headers `
  -Body '{"qr_value":"DIGIPERMIT:WP-2026-SOMPISI-001"}' -ContentType "application/json" | Out-Null

$logs = Invoke-RestMethod -Uri "$base/verification-logs?limit=3" -Headers $headers
$latest = $logs.data[0]

if (-not $latest) {
  Write-Host "[FAIL] No logs returned for verify@digipermit.demo" -ForegroundColor Red
  exit 1
}

$ageMin = ((Get-Date).ToUniversalTime() - [datetime]$latest.created_at).TotalMinutes
if ($latest.verified_by -ne $profileId) {
  Write-Host "[FAIL] Latest log is not by this officer (verified_by mismatch)" -ForegroundColor Red
  exit 1
}
if ($ageMin -gt 5) {
  Write-Host "[FAIL] Latest log is older than 5 minutes — new scan may not be visible to this user" -ForegroundColor Red
  Write-Host "       Latest: $($latest.created_at) permit $($latest.permits.permit_number)" -ForegroundColor Yellow
  exit 1
}

Write-Host "[PASS] Recent scan visible: $($latest.permits.permit_number) at $($latest.created_at)" -ForegroundColor Green
