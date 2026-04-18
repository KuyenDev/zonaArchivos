$index = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)
$lore = [System.IO.File]::ReadAllText("pages\lore.html", [System.Text.Encoding]::UTF8)
$fac = [System.IO.File]::ReadAllText("pages\factions.html", [System.Text.Encoding]::UTF8)
$ent = [System.IO.File]::ReadAllText("pages\entities.html", [System.Text.Encoding]::UTF8)
$mon = [System.IO.File]::ReadAllText("pages\monitor.html", [System.Text.Encoding]::UTF8)

$index = $index.Replace("<!-- Lore -->", $lore)
$index = $index.Replace("<!-- Factions -->", $fac)
$index = $index.Replace("<!-- Entities -->", $ent)
$index = $index.Replace("<!-- Monitor -->", $mon)

[System.IO.File]::WriteAllText("index.html", $index, [System.Text.Encoding]::UTF8)

Write-Host "Injection complete"
