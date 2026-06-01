# DigiPermit System Verification Script
# Run: powershell -ExecutionPolicy Bypass -File scripts\verify-system.ps1

$baseUrl = "http://localhost:3000/api"
$passed = 0
$failed = 0

function Test-Endpoint {
    param($Name, $ScriptBlock)
    try {
        & $ScriptBlock
        Write-Host "[PASS] $Name" -ForegroundColor Green
        $script:passed++
    } catch {
        Write-Host "[FAIL] $Name - $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
    }
}

Write-Host "`n=== DigiPermit System Verification ===`n" -ForegroundColor Cyan

Test-Endpoint "Health check" {
    $r = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    if (-not $r.success) { throw "Health failed" }
}

$loginBody = '{"email":"hr@acmeglobal.demo","password":"Demo@12345"}'
$token = $null

Test-Endpoint "Login" {
    $r = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    if (-not $r.data.session.access_token) { throw "No token" }
    $script:token = $r.data.session.access_token
}

if ($token) {
    $headers = @{ Authorization = "Bearer $token" }

    Test-Endpoint "List permits" {
        $r = Invoke-RestMethod -Uri "$baseUrl/permits" -Method Get -Headers $headers
        if ($null -eq $r.data) { throw "No data" }
    }

    Test-Endpoint "Analytics summary" {
        $r = Invoke-RestMethod -Uri "$baseUrl/analytics/summary" -Method Get -Headers $headers
        if ($null -eq $r.data) { throw "No summary" }
    }

    Test-Endpoint "Verify permit (valid)" {
        $body = '{"permit_number":"WP-2024-ACME-001"}'
        $r = Invoke-RestMethod -Uri "$baseUrl/verify" -Method Post -Headers $headers -Body $body -ContentType "application/json"
        if ($r.data.verification_result -ne "valid") { throw "Expected valid, got $($r.data.verification_result)" }
    }
}

Write-Host "`n=== Results: $passed passed, $failed failed ===`n" -ForegroundColor Cyan
if ($failed -gt 0) { exit 1 }
