import os
import re

frontend_src_dir = r"c:\Kamal\Project\HamroCinema\frontend\src"

def replace_url_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if "http://localhost:8000" in content:
        # Replace single quoted strings
        content = re.sub(r"'http://localhost:8000([^']*)'", r"`${import.meta.env.VITE_API_BASE_URL}\1`", content)
        # Replace double quoted strings
        content = re.sub(r'"http://localhost:8000([^"]*)"', r"`${import.meta.env.VITE_API_BASE_URL}\1`", content)
        # Replace backtick strings (must handle existing template literals)
        content = content.replace("`http://localhost:8000", "`${import.meta.env.VITE_API_BASE_URL}")

        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated: {filepath}")

for root, dirs, files in os.walk(frontend_src_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            replace_url_in_file(os.path.join(root, file))

print("Replacement complete.")
