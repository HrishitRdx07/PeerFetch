# PeerFetch Firewall Fix
# Run this script as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PeerFetch Network Access - Firewall Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add firewall rules for Node.js
Write-Host "Adding Windows Firewall rules..." -ForegroundColor Yellow

# Remove old rules if they exist
netsh advfirewall firewall delete rule name="Node.js Server PeerFetch" 2>$null

# Add new rule for Node.js
$nodePath = "C:\Program Files\nodejs\node.exe"
netsh advfirewall firewall add rule name="Node.js Server PeerFetch" dir=in action=allow program=$nodePath enable=yes profile=any | Out-Null

Write-Host "✓ Firewall rules added successfully!" -ForegroundColor Green
Write-Host ""

# Get IP Address
Write-Host "Getting your network information..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "10.*" -or $_.IPAddress -like "192.168.*"} | Select-Object -First 1).IPAddress

Write-Host "✓ Your IP Address: $ipAddress" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Access Information" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "From this computer:" -ForegroundColor White
Write-Host "  http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "From other devices (same WiFi):" -ForegroundColor White
Write-Host "  http://${ipAddress}:3001" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
