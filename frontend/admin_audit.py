import os
import re

ADMIN_DIR = r"c:\Kamal\Project\HamroCinema\frontend\src\pages\admin"
LAYOUT_FILE = r"c:\Kamal\Project\HamroCinema\frontend\src\layouts\AdminLayout.jsx"

replacements = {
    # Backgrounds and Dividers
    r'bg-purple-900/20': 'bg-[#1A1A1A]',
    r'divide-purple-900/20': 'divide-neutral-800',
    r'divide-zinc-800': 'divide-neutral-800',
    r'bg-stone-800': 'bg-neutral-800',
    r'bg-cyan-500/20': 'bg-[#1A1A1A]',
    r'bg-green-500/20': 'bg-[#1A1A1A]',
    r'bg-yellow-500/20': 'bg-[#1A1A1A]',
    r'bg-gray-500/20': 'bg-[#1A1A1A]',
    r'bg-red-500/10': 'bg-[#1A1A1A]',
    r'bg-pink-500/10': 'bg-[#1A1A1A]',
    r'bg-blue-500/10': 'bg-[#1A1A1A]',
    r'bg-amber-700': 'bg-white text-black',
    r'bg-amber-500': 'bg-white text-black',
    
    # Text colors
    r'text-zinc-100': 'text-neutral-100',
    r'text-zinc-500': 'text-neutral-400',
    r'text-amber-500': 'text-neutral-100',
    r'text-amber-400': 'text-neutral-100',
    r'text-[#050b14]': 'text-black',
    
    # Borders
    r'border-amber-500': 'border-neutral-100',
    r'border-amber-700/50': 'border-neutral-600',
    r'border-transparent hover:border-neutral-500': 'border-transparent hover:border-neutral-600',
    r'border-red-500/20': 'border-neutral-800',
    r'border-green-500/20': 'border-neutral-800',
    r'border-blue-500/20': 'border-neutral-800',
    
    # Hovers
    r'hover:bg-[#1A1A1A]/50': 'hover:bg-neutral-800',
    r'hover:bg-[#1A1A1A]': 'hover:bg-neutral-800',
    r'hover:bg-pink-400/10': 'hover:bg-neutral-800',
    r'hover:bg-red-500/10': 'hover:bg-neutral-800',
    r'hover:bg-red-400/10': 'hover:bg-neutral-800',
    
    # Text phrasing
    r"window.confirm\('Are you sure you want to delete this movie\? This action cannot be undone.'\)": "window.confirm('Confirm deletion of movie record? This action cannot be undone.')",
    r"window.confirm\('Are you sure you want to cancel this showtime\?'\)": "window.confirm('Confirm cancellation of showtime? This action cannot be undone.')",
    r"alert\('Failed to delete movie.'\)": "alert('Failed to delete movie record. Please try again.')",
}

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
    
    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {os.path.basename(filepath)}")
    else:
        print(f"No changes: {os.path.basename(filepath)}")

# Process admin files
for filename in os.listdir(ADMIN_DIR):
    if filename.endswith(".jsx"):
        process_file(os.path.join(ADMIN_DIR, filename))

# Process layout
process_file(LAYOUT_FILE)

print("Audit complete.")
