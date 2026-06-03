# Opens the 3 GitHub pages you need (log in as MrNtuli if prompted).
Start-Process "https://github.com/MrNtuli/DPermit/settings/pages"
Start-Sleep -Seconds 1
Start-Process "https://github.com/MrNtuli/DPermit/settings/variables/actions"
Start-Sleep -Seconds 1
Start-Process "https://github.com/MrNtuli/DPermit/actions/workflows/deploy-frontend.yml"

Write-Host "`n1. Pages: set Source to GitHub Actions" -ForegroundColor Cyan
Write-Host "2. Variables: add DIGIPERMIT_API_URL = https://dpermit.onrender.com/api" -ForegroundColor Cyan
Write-Host "3. Actions: Run workflow -> Run workflow`n" -ForegroundColor Cyan
