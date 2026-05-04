#!/usr/bin/env python3
"""
Extract CE questions from saved HTML files and update CE_DEFINITIF_toutes_series.md

HTML structure uses rendered DOM with:
- div id="review-question-N" for each question
- Level span with color classes (emerald=A1, green=A2, blue=B1, indigo=B2, purple=C1, pink=C2)
- Points span ("3pt", "9pt", etc.)
- Options in div.mb-3.space-y-1.5 > div.rounded-lg.border
- Correct answer has 'border-green-400' or 'bg-green-50' in classes
"""

import re
import os
from bs4 import BeautifulSoup

# ── Configuration ────────────────────────────────────────────────────────────

HTML_DIR = 'C:/Users/hamid/Downloads/formation-tcf-canada/HTML CE/'
MD_FILE  = 'C:/Users/hamid/Downloads/formation-tcf-canada/CE_DEFINITIF_toutes_series.md'

# File → Series number mapping (based on URL in HTML comment)
FILE_TO_SERIES = {
    '6 FORMATION TCF CANADA.html':  6,
    '8 FORMATION TCF CANADA.html':  9,   # URL shows test-9
    '14 FORMATION TCF CANADA.html': 14,
    '15 FORMATION TCF CANADA.html': 15,
    '22 FORMATION TCF CANADA.html': 22,
    '23 FORMATION TCF CANADA.html': 23,
    '26 FORMATION TCF CANADA.html': 26,
}

# Points scale by level
LEVEL_POINTS = {
    'A1': 3, 'A2': 9, 'B1': 15, 'B2': 21, 'C1': 26, 'C2': 33
}

# ── Extraction ───────────────────────────────────────────────────────────────

def extract_questions_from_html(filepath):
    """Extract all 39 questions from a saved CE HTML file."""
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    review_divs = soup.find_all('div', id=re.compile(r'^review-question-\d+$'))

    questions = []
    for div in review_divs:
        # ── Question number ──────────────────────────────────────────────────
        q_num = int(re.search(r'review-question-(\d+)', div.get('id', '')).group(1))

        # ── Level (from span text, not classes, since we now know all texts) ─
        button = div.find('button')
        level = 'UNKNOWN'
        points_str = ''

        if button:
            spans = button.find_all('span')
            for span in spans:
                txt = span.get_text(strip=True)
                if txt in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'):
                    level = txt
                elif 'pt' in txt and txt[:-2].isdigit():
                    points_str = txt

        # Fallback: infer points from level
        if not points_str and level in LEVEL_POINTS:
            points_str = f"{LEVEL_POINTS[level]}pt"

        # ── Options & correct answer ─────────────────────────────────────────
        options_container = div.find('div', class_='mb-3 space-y-1.5')
        options = []
        correct_idx = None

        if options_container:
            option_divs = options_container.find_all('div', class_=re.compile(r'rounded-lg border'))
            for i, opt_div in enumerate(option_divs):
                classes = ' '.join(opt_div.get('class', []))
                is_correct = 'green' in classes  # border-green-400 or bg-green-50

                span = opt_div.find('span', class_=re.compile(r'text-gray-700|text-green-900'))
                if span:
                    opt_text = span.get_text(strip=True)
                    options.append(opt_text)
                    if is_correct:
                        correct_idx = i

        # ── Image URL ────────────────────────────────────────────────────────
        img = div.find('img', alt=re.compile(r'Question'))
        image_url = None
        if img:
            srcset = img.get('srcset', '')
            url_match = re.search(r'url=([^&\s]+)', srcset)
            if url_match:
                from urllib.parse import unquote
                image_url = unquote(url_match.group(1))
            else:
                image_url = img.get('src', '')

        # ── Prompt text (if any non-image question) ──────────────────────────
        # Look for a prompt paragraph before the options
        prompt = None
        content_div = div.find('div', class_='border-t border-gray-100 px-3 pb-3')
        if content_div:
            # Look for paragraph tags that might contain text questions
            paras = content_div.find_all('p')
            for p in paras:
                txt = p.get_text(strip=True)
                if txt and len(txt) > 10:
                    prompt = txt
                    break

        questions.append({
            'num': q_num,
            'level': level,
            'points': points_str,
            'image_url': image_url,
            'prompt': prompt,
            'options': options,
            'correct_idx': correct_idx,
        })

    return questions


# ── Formatting ───────────────────────────────────────────────────────────────

LETTER = ['A', 'B', 'C', 'D']

def format_series_block(series_num, questions):
    """Format a series block in the required Markdown format."""
    lines = [f'## SÉRIE {series_num}', '']

    for q in sorted(questions, key=lambda x: x['num']):
        q_num = q['num']
        level = q['level']
        pts = q['points']
        options = q['options']
        correct_idx = q['correct_idx']
        prompt = q['prompt']

        # Header line: **Q1** *(image)*  _A1 3pt_
        has_image = bool(q['image_url'])
        has_text = bool(prompt)

        content_type = ''
        if has_image and not has_text:
            content_type = '*(image)*  '
        elif has_text and not has_image:
            content_type = ''
        elif has_text and has_image:
            content_type = '*(image + texte)*  '
        else:
            content_type = '*(image)*  '

        lines.append(f'**Q{q_num}** {content_type}_{level} {pts}_')

        # Add prompt text if available
        if prompt:
            lines.append(f'> {prompt}')
            lines.append('')

        # Options
        if options:
            for i, opt in enumerate(options):
                letter = LETTER[i] if i < len(LETTER) else str(i)
                # Check if this option already has letter prefix
                if re.match(r'^[A-D]\.', opt):
                    lines.append(opt)
                else:
                    lines.append(f'{letter}. {opt}')

            # Correct answer
            if correct_idx is not None and correct_idx < len(options):
                correct_opt = options[correct_idx]
                letter = LETTER[correct_idx] if correct_idx < len(LETTER) else str(correct_idx)
                if re.match(r'^[A-D]\.', correct_opt):
                    lines.append(f'✅ {correct_opt}')
                else:
                    lines.append(f'✅ {letter}. {correct_opt}')
        else:
            lines.append('*(options non disponibles)*')

        lines.append('')

    return '\n'.join(lines)


# ── MD Update ────────────────────────────────────────────────────────────────

def update_md_file(md_path, series_num, new_block):
    """Replace the existing SÉRIE N section in the MD file with new_block."""
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match the existing série section
    # Match from "## SÉRIE N" to the next "## SÉRIE" or end of file
    pattern = rf'(## SÉRIE {series_num}\b.*?)(?=\n## SÉRIE |\Z)'

    match = re.search(pattern, content, re.DOTALL)
    if match:
        old_block = match.group(0)
        # Preserve trailing newline
        new_content = content[:match.start()] + new_block.rstrip() + '\n' + content[match.end():]
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'  → Replaced SÉRIE {series_num} block ({len(old_block)} → {len(new_block)} chars)')
        return True
    else:
        print(f'  ⚠ SÉRIE {series_num} not found in MD file!')
        return False


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    print('=' * 60)
    print('CE Question Extractor — formation-tcf-canada')
    print('=' * 60)

    all_results = {}

    for html_file, series_num in sorted(FILE_TO_SERIES.items(), key=lambda x: x[1]):
        filepath = os.path.join(HTML_DIR, html_file)

        if not os.path.exists(filepath):
            print(f'\n[MISSING] {html_file}')
            continue

        print(f'\n[Processing] {html_file} → Série {series_num}')

        try:
            questions = extract_questions_from_html(filepath)
            print(f'  → Extracted {len(questions)} questions')

            if not questions:
                print('  ⚠ No questions found!')
                continue

            # Show sample (Q1 and Q10)
            for q in questions:
                if q['num'] in (1, 10, 20, 30):
                    correct_opt = ''
                    if q['correct_idx'] is not None and q['options']:
                        idx = q['correct_idx']
                        correct_opt = q['options'][idx] if idx < len(q['options']) else 'N/A'
                    has_text = 'text' if q.get('prompt') else 'image'
                    print(f'  Q{q["num"]} ({q["level"]} {q["points"]}) [{has_text}] → ✅ {correct_opt}')

            all_results[series_num] = questions

            # Format the block
            new_block = format_series_block(series_num, questions)

            # Update the MD file
            update_md_file(MD_FILE, series_num, new_block)

        except Exception as e:
            print(f'  ERROR: {e}')
            import traceback
            traceback.print_exc()

    print('\n' + '=' * 60)
    print('SUMMARY')
    print('=' * 60)
    for series_num in sorted(all_results.keys()):
        qs = all_results[series_num]
        levels = {}
        for q in qs:
            levels[q['level']] = levels.get(q['level'], 0) + 1
        has_options = sum(1 for q in qs if q['options'])
        has_correct = sum(1 for q in qs if q['correct_idx'] is not None)
        has_text = sum(1 for q in qs if q.get('prompt'))
        print(f'Série {series_num:2d}: {len(qs)} questions, '
              f'{has_options} with options, {has_correct} with correct answer, '
              f'{has_text} with text, levels={levels}')

    print('\nDone! MD file updated.')


if __name__ == '__main__':
    main()
