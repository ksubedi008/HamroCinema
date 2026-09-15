import os

base_dir = r"c:\Kamal\Project\HamroCinema"
exclude_dirs = {".git", "node_modules", "venv", "__pycache__", "dist", ".vite"}

def replace_url_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Replace the base dev urls
        new_content = content.replace("http://localhost:8000", "https://l2l1wx8c-8000.inc1.devtunnels.ms")
        new_content = new_content.replace("http://localhost:5173", "https://l2l1wx8c-5173.inc1.devtunnels.ms")
        
        # Also clean up the typo I made earlier if it exists anywhere
        new_content = new_content.replace("https://12l1wx8c-8000.inc1.devtunnels.ms", "https://l2l1wx8c-8000.inc1.devtunnels.ms")
        new_content = new_content.replace("https://12l1wx8c-5173.inc1.devtunnels.ms", "https://l2l1wx8c-5173.inc1.devtunnels.ms")
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error {filepath}: {e}")

for root, dirs, files in os.walk(base_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith(('.js', '.jsx', '.py', '.json', '.html', '.md', '.env', '.cjs', '.txt')):
            replace_url_in_file(os.path.join(root, file))

print("Replacement complete.")
