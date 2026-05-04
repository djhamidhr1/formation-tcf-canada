#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SCRAPER ULTRA-COMPLET — Formation TCF Canada
Scrape TOUT le site : tests, sujets, blog (101+ pages), pages légales, etc.
"""

import os
import time
import urllib.request
import urllib.parse
from pathlib import Path
import re

# ─── CONFIGURATION ─────────────────────────────────────────────────────────
BASE_URL = "https://www.formation-tcfcanada.com"
OUTPUT_DIR = "scraped_data_complet"
DELAY = 2  # secondes entre requêtes
MAX_BLOG_PAGES = 101  # Nombre de pages blog à scraper

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
}

# ─── URLS À SCRAPER ────────────────────────────────────────────────────────

# Pages principales déjà scrapées (on skip si exists)
MAIN_PAGES = {
    "home": f"{BASE_URL}/",
    "formations": f"{BASE_URL}/formations",
    "tarifs": f"{BASE_URL}/tarification",
    "blog_index": f"{BASE_URL}/blog",
    "contact": f"{BASE_URL}/contact",
    "faq": f"{BASE_URL}/foire-aux-questions",
    "about": f"{BASE_URL}/a-propos-pack-ayoub",
    "tcf_canada": f"{BASE_URL}/tcf-canada-test-de-connaissance-du-francais-pour-le-canada",
    "mon_compte": f"{BASE_URL}/mon-compte",

    # Pages CE/CO/EE/EO principales
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
}

# Pages légales
LEGAL_PAGES = {
    "privacy": f"{BASE_URL}/politique-de-confidentialite",
    "terms": f"{BASE_URL}/mentions-legales-et-conditions-generales-dutilisation",
    "cookies": f"{BASE_URL}/cookies",
    "refund": f"{BASE_URL}/politique-dutilisation-et-de-remboursement",
}

# Blog pages (pagination)
BLOG_PAGES = [
    f"{BASE_URL}/blog?page={i}" for i in range(1, MAX_BLOG_PAGES + 1)
]

# Séries CE (1-40 sauf 14)
CE_SERIES = [i for i in range(1, 41) if i != 14]
CE_URLS = [
    f"{BASE_URL}/epreuve/comprehension-ecrite/entrainement/comprehension-ecrite-test-{i}"
    for i in CE_SERIES
]

# Séries CO (1-40)
CO_SERIES = list(range(1, 41))
CO_URLS = []
for i in CO_SERIES:
    if i <= 10:
        CO_URLS.append(f"{BASE_URL}/epreuve/comprehension-orale/entrainement/comprehension-oral-test-{i}")
    else:
        CO_URLS.append(f"{BASE_URL}/epreuve/comprehension-orale/entrainement/comprehension-orale-test-{i}")

# Sujets EE/EO
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
EO_URLS = [
    f"{BASE_URL}/epreuve/expression-orale/sujets-actualites/{period}"
    for period in EE_PERIODS
]

# ─── FONCTIONS ─────────────────────────────────────────────────────────────

def sanitize_filename(url):
    """Crée un nom de fichier valide depuis une URL"""
    # Extraire la partie après le domaine
    path = urllib.parse.urlparse(url).path
    query = urllib.parse.urlparse(url).query

    # Combiner path + query
    filename = path.strip('/').replace('/', '_')
    if query:
        # Remplacer caractères spéciaux dans query
        query_clean = re.sub(r'[^\w\-_]', '_', query)
        filename = f"{filename}_{query_clean}"

    # Fallback si vide
    if not filename:
        filename = "index"

    return filename + '.html'

def fetch_url(url, output_path):
    """Télécharge une URL et sauvegarde le HTML"""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        response = urllib.request.urlopen(req, timeout=30)
        html = response.read().decode('utf-8', errors='replace')

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)

        return True, len(html)

    except urllib.error.HTTPError as e:
        if e.code == 404:
            return False, f"404 Not Found"
        elif e.code == 403:
            return False, f"403 Forbidden"
        else:
            return False, f"HTTP {e.code}"

    except Exception as e:
        return False, str(e)

def scrape_category(urls, category_name, output_subdir, url_to_filename_func=None):
    """Scrape une catégorie d'URLs"""
    print(f"\n{'='*70}")
    print(f"SCRAPING: {category_name}")
    print(f"{'='*70}")

    output_dir = Path(OUTPUT_DIR) / output_subdir
    success_count = 0
    skipped_count = 0
    failed_count = 0

    for i, url in enumerate(urls, 1):
        # Générer nom de fichier
        if url_to_filename_func:
            filename = url_to_filename_func(url)
        else:
            filename = sanitize_filename(url)

        output_path = output_dir / filename

        # Skip si existe
        if output_path.exists():
            print(f"[{i}/{len(urls)}] ⏭️  Skip (exists): {filename}")
            skipped_count += 1
            continue

        print(f"[{i}/{len(urls)}] 🌐 {url}", end=" ... ")
        success, result = fetch_url(url, output_path)

        if success:
            print(f"✅ {result} bytes")
            success_count += 1
        else:
            print(f"❌ {result}")
            failed_count += 1

        # Délai entre requêtes
        if i < len(urls):
            time.sleep(DELAY)

    print(f"\n📊 {category_name}:")
    print(f"   ✅ Téléchargés: {success_count}")
    print(f"   ⏭️  Skipped: {skipped_count}")
    print(f"   ❌ Échecs: {failed_count}")
    print(f"   📁 Total: {success_count + skipped_count}/{len(urls)}")

    return success_count

# ─── MAIN ──────────────────────────────────────────────────────────────────

def main():
    print("=" * 70)
    print("   SCRAPER ULTRA-COMPLET — Formation TCF Canada")
    print("=" * 70)
    print(f"\n📂 Output: {OUTPUT_DIR}")
    print(f"⏱️  Delay: {DELAY}s between requests")
    print(f"📄 Blog pages à scraper: {MAX_BLOG_PAGES}")
    print("\n🚀 Démarrage du scraping complet...\n")

    total_success = 0
    total_urls = 0
    start_time = time.time()

    # 1. Pages principales
    urls = list(MAIN_PAGES.values())
    total_urls += len(urls)
    total_success += scrape_category(
        urls, "Pages Principales", "pages_principales"
    )

    # 2. Pages légales
    urls = list(LEGAL_PAGES.values())
    total_urls += len(urls)
    total_success += scrape_category(
        urls, "Pages Légales", "pages_legales"
    )

    # 3. Blog (101 pages)
    total_urls += len(BLOG_PAGES)
    total_success += scrape_category(
        BLOG_PAGES, f"Blog ({MAX_BLOG_PAGES} pages)", "blog"
    )

    # 4. Séries CE
    total_urls += len(CE_URLS)
    total_success += scrape_category(
        CE_URLS, f"Séries CE (39 tests)", "ce_series"
    )

    # 5. Séries CO
    total_urls += len(CO_URLS)
    total_success += scrape_category(
        CO_URLS, f"Séries CO (40 tests)", "co_series"
    )

    # 6. Sujets EE
    total_urls += len(EE_URLS)
    total_success += scrape_category(
        EE_URLS, f"Sujets EE ({len(EE_PERIODS)} périodes)", "ee_sujets"
    )

    # 7. Sujets EO
    total_urls += len(EO_URLS)
    total_success += scrape_category(
        EO_URLS, f"Sujets EO ({len(EE_PERIODS)} périodes)", "eo_sujets"
    )

    # Résumé final
    duration = time.time() - start_time
    minutes = int(duration // 60)
    seconds = int(duration % 60)

    print("\n" + "=" * 70)
    print("   📊 RÉSUMÉ FINAL")
    print("=" * 70)
    print(f"⏱️  Durée totale: {minutes}m {seconds}s")
    print(f"🌐 URLs tentées: {total_urls}")
    print(f"✅ Téléchargements réussis: {total_success}")
    print(f"❌ Échecs: {total_urls - total_success}")
    print(f"📁 Dossier: {OUTPUT_DIR}/")
    print("=" * 70)
    print("\n✅ SCRAPING ULTRA-COMPLET TERMINÉ !")

if __name__ == "__main__":
    main()
