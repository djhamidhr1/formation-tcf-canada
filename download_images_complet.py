#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TÉLÉCHARGEUR COMPLET IMAGES CE/CO
Télécharge toutes les images depuis les URLs en base de données
"""

import urllib.request
import json
import time
from pathlib import Path

# Configuration Supabase
SUPABASE_URL = "https://fvhxptpzskvwpdtycklj.supabase.co/rest/v1"
ANON_KEY = "sb_publishable_CCngbc2lcuU8h1po3DzqYg_25JYjF7Q"
HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}"
}

OUTPUT_DIR = "images_local"
DELAY = 0.1  # 100ms entre téléchargements

def fetch_images_ce():
    """Récupère toutes les URLs images CE depuis Supabase"""
    url = f"{SUPABASE_URL}/questions_ce?select=id,image_url&image_url=not.is.null"
    req = urllib.request.Request(url, headers=HEADERS)
    response = urllib.request.urlopen(req)
    return json.loads(response.read())

def fetch_images_co():
    """Récupère toutes les URLs images CO depuis Supabase"""
    url = f"{SUPABASE_URL}/questions_co?select=id,image_url&image_url=not.is.null"
    req = urllib.request.Request(url, headers=HEADERS)
    response = urllib.request.urlopen(req)
    return json.loads(response.read())

def download_image(image_url, output_path):
    """Télécharge une image"""
    try:
        urllib.request.urlretrieve(image_url, output_path)
        return True, len(open(output_path, 'rb').read())
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 70)
    print("   TÉLÉCHARGEMENT COMPLET IMAGES CE/CO")
    print("=" * 70)

    total_size = 0
    success_count = 0
    skip_count = 0
    error_count = 0

    start_time = time.time()

    # 1. Images CE
    print("\n[1/2] Récupération des URLs images CE...")
    ce_images = fetch_images_ce()
    print(f"  → {len(ce_images)} images CE trouvées")

    ce_dir = Path(OUTPUT_DIR) / "ce"
    ce_dir.mkdir(parents=True, exist_ok=True)

    print("\n[1/2] Téléchargement images CE...")
    for i, row in enumerate(ce_images, 1):
        if not row.get('image_url'):
            continue

        # Déterminer extension depuis URL
        ext = '.png' if '.png' in row['image_url'] else '.jpg'
        output_path = ce_dir / f"{row['id']}{ext}"

        if output_path.exists():
            skip_count += 1
            if i % 50 == 1:
                print(f"  [{i}/{len(ce_images)}] ⏭️  Déjà téléchargées")
            continue

        success, result = download_image(row['image_url'], output_path)

        if success:
            success_count += 1
            total_size += result
            if i % 50 == 1:
                print(f"  [{i}/{len(ce_images)}] ✅ Téléchargées")
        else:
            error_count += 1
            if i % 50 == 1:
                print(f"  [{i}/{len(ce_images)}] ❌ Erreurs")

        time.sleep(DELAY)

    print(f"  ✅ CE: {success_count} téléchargées, {skip_count} skipped, {error_count} erreurs")

    # 2. Images CO
    print("\n[2/2] Récupération des URLs images CO...")
    co_images = fetch_images_co()
    print(f"  → {len(co_images)} images CO trouvées")

    co_dir = Path(OUTPUT_DIR) / "co"
    co_dir.mkdir(parents=True, exist_ok=True)

    ce_success = success_count
    ce_skip = skip_count
    ce_error = error_count

    success_count = 0
    skip_count = 0
    error_count = 0

    print("\n[2/2] Téléchargement images CO...")
    for i, row in enumerate(co_images, 1):
        if not row.get('image_url'):
            continue

        ext = '.png' if '.png' in row['image_url'] else '.jpg'
        output_path = co_dir / f"{row['id']}{ext}"

        if output_path.exists():
            skip_count += 1
            if i % 20 == 1:
                print(f"  [{i}/{len(co_images)}] ⏭️  Déjà téléchargées")
            continue

        success, result = download_image(row['image_url'], output_path)

        if success:
            success_count += 1
            total_size += result
            if i % 20 == 1:
                print(f"  [{i}/{len(co_images)}] ✅ Téléchargées")
        else:
            error_count += 1
            if i % 20 == 1:
                print(f"  [{i}/{len(co_images)}] ❌ Erreurs")

        time.sleep(DELAY)

    print(f"  ✅ CO: {success_count} téléchargées, {skip_count} skipped, {error_count} erreurs")

    duration = time.time() - start_time
    minutes = int(duration // 60)
    seconds = int(duration % 60)

    print("\n" + "=" * 70)
    print("   RÉSUMÉ TÉLÉCHARGEMENT")
    print("=" * 70)
    print(f"⏱️  Durée: {minutes}m {seconds}s")
    print(f"📊 CE: {ce_success} téléchargées, {ce_skip} skipped, {ce_error} erreurs")
    print(f"📊 CO: {success_count} téléchargées, {skip_count} skipped, {error_count} erreurs")
    print(f"💾 Taille totale: {total_size / 1024 / 1024:.2f} MB")
    print(f"📁 Dossier: {OUTPUT_DIR}/")
    print("=" * 70)
    print("\n✅ TÉLÉCHARGEMENT TERMINÉ !")

if __name__ == "__main__":
    main()
