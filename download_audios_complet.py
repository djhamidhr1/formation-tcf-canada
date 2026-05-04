#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TÉLÉCHARGEUR COMPLET AUDIOS CO
Télécharge les 1 560 fichiers MP3 depuis Supabase Storage
"""

import urllib.request
import os
from pathlib import Path
import time

# Configuration
BASE_URL = "https://fvhxptpzskvwpdtycklj.supabase.co/storage/v1/object/public/audios-co"
OUTPUT_DIR = "audios_co_local"
DELAY = 0.1  # Délai entre téléchargements (100ms)

def download_audio(serie, question, output_path):
    """Télécharge un fichier audio"""
    url = f"{BASE_URL}/serie_{serie}/question_{question}.mp3"

    try:
        urllib.request.urlretrieve(url, output_path)
        return True, len(open(output_path, 'rb').read())
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 70)
    print("   TÉLÉCHARGEMENT COMPLET AUDIOS CO")
    print("=" * 70)
    print(f"\nSource: Supabase Storage (audios-co)")
    print(f"Destination: {OUTPUT_DIR}/")
    print(f"Total à télécharger: 1560 fichiers (~500 MB)")
    print("\n🚀 Démarrage...\n")

    total_files = 0
    total_size = 0
    success_count = 0
    skip_count = 0
    error_count = 0

    start_time = time.time()

    for serie in range(1, 41):  # Séries 1-40
        serie_dir = Path(OUTPUT_DIR) / f"serie_{serie}"
        serie_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n[Série {serie}/40]")

        for question in range(1, 40):  # Questions 1-39
            total_files += 1
            output_path = serie_dir / f"question_{question}.mp3"

            # Skip si existe déjà
            if output_path.exists():
                skip_count += 1
                if question % 10 == 1:
                    print(f"  Q{question:02d}-{min(question+9, 39):02d}: ⏭️  Déjà téléchargés")
                continue

            # Télécharger
            success, result = download_audio(serie, question, output_path)

            if success:
                success_count += 1
                total_size += result

                if question % 10 == 1:
                    size_mb = result / 1024 / 1024
                    print(f"  Q{question:02d}: ✅ {size_mb:.2f} MB")
            else:
                error_count += 1
                print(f"  Q{question:02d}: ❌ {result}")

            # Délai pour ne pas surcharger le serveur
            time.sleep(DELAY)

    duration = time.time() - start_time
    minutes = int(duration // 60)
    seconds = int(duration % 60)

    print("\n" + "=" * 70)
    print("   RÉSUMÉ TÉLÉCHARGEMENT")
    print("=" * 70)
    print(f"⏱️  Durée: {minutes}m {seconds}s")
    print(f"📊 Fichiers traités: {total_files}")
    print(f"✅ Téléchargés: {success_count}")
    print(f"⏭️  Skipped: {skip_count}")
    print(f"❌ Erreurs: {error_count}")
    print(f"💾 Taille totale: {total_size / 1024 / 1024:.2f} MB")
    print(f"📁 Dossier: {OUTPUT_DIR}/")
    print("=" * 70)
    print("\n✅ TÉLÉCHARGEMENT TERMINÉ !")

if __name__ == "__main__":
    main()
