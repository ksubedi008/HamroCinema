import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '/cinema-hq-99x' in content:
            content = content.replace('/cinema-hq-99x', '/k-subedi-08')
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

src_dir = r"c:\Kamal\Project\HamroCinema\frontend\src"

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".jsx"):
            replace_in_file(os.path.join(root, file))
