param(
    [string]$FilePath = "c:\Users\jeanz\OneDrive\Desktop\ROI Labs\Doc-CRM\messages\pt-BR\marketing.json",
    [string]$InsertFragmentPath = "c:\Users\jeanz\OneDrive\Desktop\ROI Labs\Doc-CRM\scripts\new-integrations-ptbr.json"
)

$content = [System.IO.File]::ReadAllText($FilePath, [System.Text.Encoding]::UTF8)

if ($content -match '"whatsappEvolution"') {
    Write-Host "whatsappEvolution already exists — skipping"
    exit 0
}

$newFragment = [System.IO.File]::ReadAllText($InsertFragmentPath, [System.Text.Encoding]::UTF8)

# Old: closing of apiWebhooks items block then items closes
$oldEnd = "                                                                      }
                                                       }
                                   },"

$newEnd = "                                                                      }
                                                       }
                                   },$newFragment
                                   },"

$newContent = $content.Replace($oldEnd, $newEnd)

if ($newContent -eq $content) {
    Write-Host "ERROR: Pattern not found. No replacement made."
    exit 1
}

[System.IO.File]::WriteAllText($FilePath, $newContent, [System.Text.Encoding]::UTF8)
Write-Host "Inserted new integrations"

# Verify JSON
try { $null = $newContent | ConvertFrom-Json; Write-Host "JSON is VALID" } catch { Write-Host "JSON ERROR: $_" }
