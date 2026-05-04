import os
import pytesseract
from PIL import Image

# --- CONFIGURATION ---
# Chemin vers l'exécutable Tesseract (si Windows, souvent ici)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

base_path = r"C:\Users\hamid\Downloads\formation-tcf-canada\HTML CE"
output_file = os.path.join(base_path, "EXTRACTION_QUESTIONS_TCF.txt")

with open(output_file, "w", encoding="utf-8") as f_out:
    # On boucle sur les dossiers de 10 à 27
    for i in range(10, 28):
        folder_name = f"{i} FORMATION TCF CANADA_files"
        folder_path = os.path.join(base_path, folder_name)
        
        if os.path.exists(folder_path):
            print(f"Extraction du texte pour la série {i}...")
            f_out.write(f"--- SÉRIE {i} ---\n\n")
            
            # On cherche les fichiers PNG dans le dossier
            for file in os.listdir(folder_path):
                if file.lower().endswith(".png"):
                    img_path = os.path.join(folder_path, file)
                    
                    try:
                        # 1. Charger l'image
                        img = Image.open(img_path)
                        
                        # 2. Extraire le texte (en français)
                        extracted_text = pytesseract.image_to_string(img, lang='fra')
                        
                        # 3. Formater et écrire dans le fichier
                        f_out.write(f"**Question : {i}**\n\n")
                        f_out.write(f"**Le texte :**\n")
                        f_out.write(f"« {extracted_text.strip()} »\n\n")
                        f_out.write("-" * 30 + "\n\n")
                        
                    except Exception as e:
                        print(f"Erreur sur l'image {file} : {e}")
        else:
            print(f"Dossier {folder_name} introuvable.")

print(f"\nTerminé ! Tout le texte est dans : {output_file}")