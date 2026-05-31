# ============================================
# add-domain.ps1
# Adds cavecrew.vercel.app to Firebase Auth
# authorized domains via REST API
# ============================================

$projectId = "social-media-79409"
$domain    = "cavecrew.vercel.app"

# Get access token from Firebase CLI
$token = (firebase auth:print-access-token 2>$null).Trim()

if (-not $token) {
  Write-Host "❌ Could not get access token. Run: firebase login" -ForegroundColor Red
  exit 1
}

Write-Host "✅ Got access token" -ForegroundColor Green

# Fetch current config to get existing authorized domains
$getUrl = "https://identitytoolkit.googleapis.com/admin/v2/projects/$projectId/config"
$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

$currentConfig = Invoke-RestMethod -Uri $getUrl -Headers $headers -Method Get
$existingDomains = $currentConfig.authorizedDomains

Write-Host "Current domains: $($existingDomains -join ', ')"

# Add new domain if not already present
if ($existingDomains -contains $domain) {
  Write-Host "✅ $domain is already authorized!" -ForegroundColor Green
} else {
  $newDomains = $existingDomains + $domain

  $body = @{
    authorizedDomains = $newDomains
  } | ConvertTo-Json

  $patchUrl = "$getUrl`?updateMask=authorizedDomains"
  $result = Invoke-RestMethod -Uri $patchUrl -Headers $headers -Method Patch -Body $body

  Write-Host "✅ Successfully added $domain to authorized domains!" -ForegroundColor Green
  Write-Host "All domains: $($result.authorizedDomains -join ', ')"
}
