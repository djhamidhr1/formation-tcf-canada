#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SCRAPER COMPLET — Formation TCF Canada
Scrape toutes les données publiquement accessibles du site
"""

import os
import time
import urllib.request
from pathlib import Path

# ─── CONFIGURATION ─────────────────────────────────────────────────────────
BASE_URL = "https://www.formation-tcfcanada.com"
OUTPUT_DIR = "scraped_data"
DELAY = 2  # secondes entre requêtes (respecter le serveur)

# Headers pour simuler un navigateur
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
}

# ─── URLS À SCRAPER ────────────────────────────────────────────────────────

# Séries CE (tests 1-40, sauf 14 inexistant)
CE_SERIES = [i for i in range(1, 41) if i != 14]
CE_URLS = [
    f"{BASE_URL}/epreuve/comprehension-ecrite/entrainement/comprehension-ecrite-test-{i}"
    for i in CE_SERIES
]

# Séries CO (tests 1-40)
CO_SERIES = list(range(1, 41))
# Séries 1-10 : comprehension-oral (sans 'e')
# Séries 11-40 : comprehension-orale (avec 'e')
CO_URLS = []
for i in CO_SERIES:
    if i <= 10:
        CO_URLS.append(f"{BASE_URL}/epreuve/comprehension-orale/entrainement/comprehension-oral-test-{i}")
    else:
        CO_URLS.append(f"{BASE_URL}/epreuve/comprehension-orale/entrainement/comprehension-orale-test-{i}")

# Sujets EE par mois/année
EE_PERIODS = [
    "aout-2024", "septembre-2024", "octobre-2024", "novembre-2024", "decembre-2024",
    "janvier-2025", "fevrier-2025", "mars-2025", "avril-2025", "mai-2025", "juin-2025",
    "juillet-2025", "aout-2025", "septembre-2025", "octobre-2025", "novembre-2025", "decembre-2025",
    "janvier-2026", "fevrier-2026", "mars-2026", "avril-2026"
]
EE_URLS = [
    f"{BASE_URL}/epreuve/expression-ecrite/sujets-actualites/{period}"
    for period in EE_PERIODS
]

# Sujets EO par mois/année (même périodes que EE)
EO_URLS = [
    f"{BASE_URL}/epreuve/expression-orale/sujets-actualites/{period}"
    for period in EE_PERIODS
]

# Pages principales
MAIN_PAGES = {
    "ce_home": f"{BASE_URL}/epreuve/comprehension-ecrite",
    "ce_series": f"{BASE_URL}/epreuve/comprehension-ecrite/series",
    "ce_tips": f"{BASE_URL}/epreuve/comprehension-ecrite/astuces",

    "co_home": f"{BASE_URL}/epreuve/comprehension-orale",
    "co_series": f"{BASE_URL}/epreuve/comprehension-orale/series",
    "co_tips": f"{BASE_URL}/epreuve/comprehension-orale/astuces",

    "ee_home": f"{BASE_URL}/epreuve/expression-ecrite",
    "ee_tips": f"{BASE_URL}/epreuve/expression-ecrite/astuces",

    "eo_home": f"{BASE_URL}/epreuve/expression-orale",
    "eo_tips": f"{BASE_URL}/epreuve/expression-orale/astuces",

    "pricing": f"{BASE_URL}/tarification",
    "formations": f"{BASE_URL}/formations",
    "faq": f"{BASE_URL}/foire-aux-questions",
    "about": f"{BASE_URL}/a-propos-pack-ayoub",
}

# ─── FONCTIONS ─────────────────────────────────────────────────────────────

def fetch_url(url, output_path):
    """Télécharge une URL et sauvegarde le HTML"""
    try:
        print(f"  Fetching: {url}")
        req = urllib.request.Request(url, headers=HEADERS)
        response = urllib.request.urlopen(req, timeout=30)
        html = response.read().decode('utf-8', errors='replace')

        # Sauvegarder
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)

        print(f"  ✅ Saved: {output_path.name} ({len(html)} bytes)")
        return True

    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"  ⚠️  404 Not Found (normal si test premium)")
        elif e.code == 403:
            print(f"  🔒 403 Forbidden (accès premium requis)")
        else:
            print(f"  ❌ HTTP Error {e.code}")
        return False

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def scrape_category(urls, category_name, output_subdir):
    """Scrape une catégorie d'URLs"""
    print(f"\n{'='*60}")
    print(f"SCRAPING: {category_name}")
    print(f"{'='*60}")

    output_dir = Path(OUTPUT_DIR) / output_subdir
    success_count = 0

    for i, url in enumerate(urls, 1):
        filename = url.split('/')[-1] + '.html'
        output_path = output_dir / filename

        # Skip si déjà téléchargé
        if output_path.exists():
            print(f"[{i}/{len(urls)}] ⏭️  Skip (exists): {filename}")
            success_count += 1
            continue

        print(f"[{i}/{len(urls)}]", end=" ")
        if fetch_url(url, output_path):
            success_count += 1

        # Délai entre requêtes
        if i < len(urls):
            time.sleep(DELAY)

    print(f"\n✅ {category_name}: {success_count}/{len(urls)} téléchargés")
    return success_count

# ─── MAIN ──────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("   SCRAPER COMPLET — Formation TCF Canada")
    print("=" * 60)
    print(f"\nOutput directory: {OUTPUT_DIR}")
    print(f"Delay between requests: {DELAY}s")

    total_success = 0
    total_urls = 0

    # 1. Pages principales
    total_urls += len(MAIN_PAGES)
    total_success += scrape_category(
        MAIN_PAGES.values(),
        "Pages Principales",
        "pages"
    )

    # 2. Séries CE
    total_urls += len(CE_URLS)
    total_success += scrape_category(
        CE_URLS,
        f"Séries CE (39 tests)",
        "ce_series"
    )

    # 3. Séries CO
    total_urls += len(CO_URLS)
    total_success += scrape_category(
        CO_URLS,
        f"Séries CO (40 tests)",
        "co_series"
    )

    # 4. Sujets EE
    total_urls += len(EE_URLS)
    total_success += scrape_category(
        EE_URLS,
        f"Sujets EE ({len(EE_PERIODS)} périodes)",
        "ee_sujets"
    )

    # 5. Sujets EO
    total_urls += len(EO_URLS)
    total_success += scrape_category(
        EO_URLS,
        f"Sujets EO ({len(EE_PERIODS)} périodes)",
        "eo_sujets"
    )

    # Résumé final
    print("\n" + "=" * 60)
    print("   RÉSUMÉ FINAL")
    print("=" * 60)
    print(f"Total URLs: {total_urls}")
    print(f"Succès: {total_success}")
    print(f"Échecs: {total_urls - total_success}")
    print(f"\nFichiers sauvegardés dans: {OUTPUT_DIR}/")
    print("=" * 60)

if __name__ == "__main__":
    main()
