# =============================================================================
# GREY STRATUM — COMPREHENSIVE VALIDATION SCRIPT
# Run from D:\gs_rpg
# =============================================================================

Write-Host "`n" -NoNewline
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "  GREY STRATUM - COMPREHENSIVE VALIDATION" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# -----------------------------------------------------------------------------
# 1. FILE EXISTENCE CHECK
# -----------------------------------------------------------------------------
Write-Host "[1/7] Checking required files exist..." -ForegroundColor Yellow

$requiredFiles = @(
    "src/App.jsx",
    "src/components/CharacterGallery.jsx",
    "src/components/CharacterCard.jsx",
    "src/components/NarrativePanel.jsx",
    "src/components/CommandBar.jsx",
    "src/components/ShadeBar.jsx",
    "src/components/InventoryModal.jsx",
    "src/components/JournalModal.jsx",
    "src/components/HelpModal.jsx",
    "src/engine/game_engine.js",
    "src/data/classes/classLibrary.js",
    "src/data/acts/act1_circuit.js",
    "src/data/systems/echo_journal.js",
    "src/data/content/items.js",
    "src/styles/GameUI.css",
    "index.html",
    "package.json"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $errors += "Missing file: $file"
    }
}

# -----------------------------------------------------------------------------
# 2. CHARACTER IMAGES CHECK
# -----------------------------------------------------------------------------
Write-Host "`n[2/7] Checking character images..." -ForegroundColor Yellow

$imageChecks = @(
    @{path="public/character-images/sentinel/s1.jpg"; name="Sentinel s1"},
    @{path="public/character-images/sentinel/s2.jpg"; name="Sentinel s2"},
    @{path="public/character-images/sentinel/s3.jpg"; name="Sentinel s3"},
    @{path="public/character-images/stalker/st1.jpg"; name="Stalker st1"},
    @{path="public/character-images/stalker/st2.jpg"; name="Stalker st2"},
    @{path="public/character-images/stalker/st3.jpg"; name="Stalker st3"},
    @{path="public/character-images/stalker/st4.jpg"; name="Stalker st4"},
    @{path="public/character-images/oracle/o1.jpg"; name="Oracle o1"},
    @{path="public/character-images/oracle/o2.jpg"; name="Oracle o2"},
    @{path="public/character-images/vanguard/v1.jpg"; name="Vanguard v1"},
    @{path="public/character-images/vanguard/v2.jpg"; name="Vanguard v2"},
    @{path="public/character-images/forger/f1.jpg"; name="Forger f1"},
    @{path="public/character-images/forger/f2.jpg"; name="Forger f2"},
    @{path="public/character-images/cleric/c1.jpg"; name="Cleric c1"},
    @{path="public/character-images/cleric/c2.jpg"; name="Cleric c2"}
)

foreach ($img in $imageChecks) {
    if (Test-Path $img.path) {
        Write-Host "  [OK] $($img.name)" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $($img.name) - $($img.path)" -ForegroundColor Red
        $errors += "Missing image: $($img.path)"
    }
}

# -----------------------------------------------------------------------------
# 3. IMPORT/EXPORT VALIDATION
# -----------------------------------------------------------------------------
Write-Host "`n[3/7] Validating imports and exports..." -ForegroundColor Yellow

# Check App.jsx imports
$appContent = Get-Content "src/App.jsx" -Raw -ErrorAction SilentlyContinue
if ($appContent) {
    $expectedImports = @(
        "CharacterGallery",
        "CharacterCard",
        "NarrativePanel",
        "CommandBar",
        "ShadeBar",
        "InventoryModal",
        "JournalModal",
        "HelpModal",
        "createInitialGameState",
        "getCurrentNode",
        "processChoice",
        "advanceNarrative",
        "saveGame",
        "loadGame"
    )
    
    foreach ($import in $expectedImports) {
        if ($appContent -match $import) {
            Write-Host "  [OK] App imports $import" -ForegroundColor Green
        } else {
            Write-Host "  [MISSING] App missing import: $import" -ForegroundColor Red
            $errors += "App.jsx missing import: $import"
        }
    }
}

# Check game_engine exports
$engineContent = Get-Content "src/engine/game_engine.js" -Raw -ErrorAction SilentlyContinue
if ($engineContent) {
    $expectedExports = @(
        "createInitialGameState",
        "getCurrentNode",
        "processChoice",
        "advanceNarrative",
        "addItemToInventory",
        "combineItems",
        "saveGame",
        "loadGame"
    )
    
    foreach ($export in $expectedExports) {
        if ($engineContent -match "export.*$export") {
            Write-Host "  [OK] Engine exports $export" -ForegroundColor Green
        } else {
            Write-Host "  [MISSING] Engine missing export: $export" -ForegroundColor Red
            $errors += "game_engine.js missing export: $export"
        }
    }
}

# -----------------------------------------------------------------------------
# 4. CLASS LIBRARY VALIDATION
# -----------------------------------------------------------------------------
Write-Host "`n[4/7] Validating class library..." -ForegroundColor Yellow

$classContent = Get-Content "src/data/classes/classLibrary.js" -Raw -ErrorAction SilentlyContinue
if ($classContent) {
    $classes = @("sentinel", "void-stalker", "oracle", "vanguard", "forger", "cleric")
    foreach ($class in $classes) {
        if ($classContent -match $class) {
            Write-Host "  [OK] Class defined: $class" -ForegroundColor Green
        } else {
            Write-Host "  [MISSING] Class not defined: $class" -ForegroundColor Red
            $errors += "classLibrary.js missing class: $class"
        }
    }
}

# -----------------------------------------------------------------------------
# 5. STORY NODE VALIDATION
# -----------------------------------------------------------------------------
Write-Host "`n[5/7] Validating Act 1 story nodes..." -ForegroundColor Yellow

$act1Content = Get-Content "src/data/acts/act1_circuit.js" -Raw -ErrorAction SilentlyContinue
if ($act1Content) {
    $keyNodes = @(
        "prologue-tribunal",
        "prologue-response",
        "circuit-arrival",
        "circuit-hub",
        "descent-decision",
        "act1-survivor-ending",
        "act1-descent-transition"
    )
    
    foreach ($node in $keyNodes) {
        if ($act1Content -match "'$node'") {
            Write-Host "  [OK] Node exists: $node" -ForegroundColor Green
        } else {
            Write-Host "  [MISSING] Node not found: $node" -ForegroundColor Red
            $errors += "act1_circuit.js missing node: $node"
        }
    }
}

# -----------------------------------------------------------------------------
# 6. CSS CLASS CROSS-REFERENCE
# -----------------------------------------------------------------------------
Write-Host "`n[6/7] Cross-referencing CSS classes..." -ForegroundColor Yellow

# Get all className references from JSX
$jsxClasses = @()
Get-ChildItem -Path "src" -Recurse -Include "*.jsx" | ForEach-Object {
    Select-String -Path $_.FullName -Pattern 'className="([^"]+)"' -AllMatches | ForEach-Object {
        $_.Matches | ForEach-Object { 
            $_.Groups[1].Value -split ' ' | ForEach-Object { $jsxClasses += $_ }
        }
    }
}
$jsxClasses = $jsxClasses | Sort-Object -Unique

# Get all CSS class definitions
$cssContent = Get-Content "src/styles/GameUI.css" -Raw -ErrorAction SilentlyContinue
$cssClasses = @()
if ($cssContent) {
    [regex]::Matches($cssContent, '\.([a-zA-Z][\w-]*)') | ForEach-Object {
        $cssClasses += $_.Groups[1].Value
    }
}
$cssClasses = $cssClasses | Sort-Object -Unique

# Find mismatches
$missingInCss = $jsxClasses | Where-Object { $_ -notin $cssClasses -and $_ -ne '' }
$unusedInJsx = $cssClasses | Where-Object { $_ -notin $jsxClasses }

if ($missingInCss.Count -eq 0) {
    Write-Host "  [OK] All JSX classes have CSS definitions" -ForegroundColor Green
} else {
    Write-Host "  [WARNING] JSX classes missing in CSS:" -ForegroundColor Yellow
    $missingInCss | ForEach-Object { 
        Write-Host "    - $_" -ForegroundColor Yellow
        $warnings += "CSS missing class: $_"
    }
}

# -----------------------------------------------------------------------------
# 7. PACKAGE.JSON VALIDATION
# -----------------------------------------------------------------------------
Write-Host "`n[7/7] Validating package.json..." -ForegroundColor Yellow

$packageContent = Get-Content "package.json" -Raw -ErrorAction SilentlyContinue
if ($packageContent) {
    $requiredDeps = @("react", "react-dom")
    $requiredDevDeps = @("vite", "@vitejs/plugin-react")
    
    foreach ($dep in $requiredDeps) {
        if ($packageContent -match "`"$dep`"") {
            Write-Host "  [OK] Dependency: $dep" -ForegroundColor Green
        } else {
            Write-Host "  [MISSING] Dependency: $dep" -ForegroundColor Red
            $errors += "package.json missing dependency: $dep"
        }
    }
    
    foreach ($dep in $requiredDevDeps) {
        if ($packageContent -match "`"$dep`"") {
            Write-Host "  [OK] DevDependency: $dep" -ForegroundColor Green
        } else {
            Write-Host "  [MISSING] DevDependency: $dep" -ForegroundColor Red
            $errors += "package.json missing devDependency: $dep"
        }
    }
}

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Host "`n"
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "  VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "`n  ALL CHECKS PASSED!" -ForegroundColor Green
} else {
    if ($errors.Count -gt 0) {
        Write-Host "`n  ERRORS ($($errors.Count)):" -ForegroundColor Red
        $errors | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "`n  WARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
        $warnings | ForEach-Object { Write-Host "    - $_" -ForegroundColor Yellow }
    }
}

Write-Host "`n"
