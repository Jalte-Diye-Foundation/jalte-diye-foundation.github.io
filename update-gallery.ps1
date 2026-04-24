# Run this script from the repo root whenever you add or remove images from gallery/
# It regenerates gallery/images.json automatically.

$galleryPath = Join-Path $PSScriptRoot "gallery"
$jsonPath    = Join-Path $galleryPath "images.json"

$imageExtensions = @(".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg")

$images = Get-ChildItem -Path $galleryPath -File |
    Where-Object { $imageExtensions -contains $_.Extension.ToLower() } |
    Sort-Object Name |
    ForEach-Object { $_.Name }

$images | ConvertTo-Json -Depth 1 | Set-Content -Encoding UTF8 $jsonPath

Write-Host "gallery/images.json updated with $($images.Count) image(s):"
$images | ForEach-Object { Write-Host "  $_" }
