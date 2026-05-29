import os

frontend_src_dir = r"c:\Kamal\Project\HamroCinema\frontend\src"

def replace_url_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if "http://localhost:8000" in content:
        # We need to replace string literals correctly depending on quotes
        # Often it's 'http://localhost:8000/api/...' or `http://localhost:8000/api/...`
        # Because we want to use import.meta.env.VITE_API_BASE_URL + '/api/...',
        # It's better to replace 'http://localhost:8000' with `import.meta.env.VITE_API_BASE_URL`
        
        # A simple replacement:
        # If it's inside backticks: `http://localhost:8000/api...` -> `${import.meta.env.VITE_API_BASE_URL}/api...`
        content = content.replace("`http://localhost:8000", "`${import.meta.env.VITE_API_BASE_URL}")
        
        # If it's inside single quotes: 'http://localhost:8000/api...' -> `${import.meta.env.VITE_API_BASE_URL}/api...`
        # Wait, if we change single quotes to backticks, we have to change the ending quote too.
        # It's easier to just replace 'http://localhost:8000/api/...' with import.meta.env.VITE_API_BASE_URL + '/api/...'
        # Or better yet, we just change the entire string to a template literal.
        
        import re
        # Find 'http://localhost:8000/...'
        content = re.sub(r"'http://localhost:8000([^']*)'", r"`${import.meta.env.VITE_API_BASE_URL}\1`", content)
        
        # Find "http://localhost:8000/..."
        content = re.sub(r'"http://localhost:8000([^"]*)"', r"`${import.meta.env.VITE_API_BASE_URL}\1`", content)

        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated: {filepath}")

for root, dirs, files in os.walk(frontend_src_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            replace_url_in_file(os.path.join(root, file))

print("Replacement complete.")
