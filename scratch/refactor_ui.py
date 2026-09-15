import os
import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    replacements = {
        # Layouts
        r'\bbg-zinc-900\b': 'bg-white dark:bg-zinc-900',
        r'\bbg-zinc-950\b': 'bg-gray-50 dark:bg-zinc-950',
        r'\bbg-stone-900\b': 'bg-gray-200 dark:bg-stone-900',
        r'\bbg-stone-950\b': 'bg-gray-50 dark:bg-stone-950',
        r'\bborder-zinc-800\b': 'border-gray-200 dark:border-zinc-800',
        r'\bborder-stone-800\b': 'border-gray-300 dark:border-stone-800',
        
        # Text colors
        r'\btext-white\b': 'text-gray-900 dark:text-white',
        r'\btext-zinc-100\b': 'text-gray-900 dark:text-zinc-100',
        r'\btext-gray-200\b': 'text-gray-800 dark:text-gray-200',
        r'\btext-gray-300\b': 'text-gray-700 dark:text-gray-300',
        r'\btext-gray-400\b': 'text-gray-600 dark:text-gray-400',
        r'\btext-zinc-300\b': 'text-gray-700 dark:text-zinc-300',
        r'\btext-zinc-400\b': 'text-gray-600 dark:text-zinc-400',
        r'\btext-zinc-500\b': 'text-gray-500 dark:text-zinc-500',
        r'\btext-stone-300\b': 'text-gray-700 dark:text-stone-300',
        r'\btext-stone-400\b': 'text-gray-600 dark:text-stone-400',
        r'\btext-stone-500\b': 'text-gray-500 dark:text-stone-500',
        
        # Hover texts
        r'\bhover:text-white\b': 'hover:text-gray-900 dark:hover:text-white',
        r'\bhover:text-gray-300\b': 'hover:text-gray-900 dark:hover:text-gray-300',
        
        # Gradients
        r'\bfrom-stone-950\b': 'from-white dark:from-stone-950',
        r'\bto-stone-950/90\b': 'to-white/90 dark:to-stone-950/90',
        r'\bfrom-stone-800/50\b': 'from-gray-300/50 dark:from-stone-800/50',
        r'\bto-stone-950\b': 'to-gray-100 dark:to-stone-950',
        r'\bvia-stone-950/80\b': 'via-gray-50/80 dark:via-stone-950/80',
        r'\bto-stone-950/20\b': 'to-gray-50/20 dark:to-stone-950/20',
        
        # Fix specific hover: hover:/20 typo in CustomerLayout.jsx if exists
        r'hover: hover:/20': 'hover:bg-gray-100 dark:hover:bg-white/20',
    }

    # First clean up any existing dark: prefixes if they accidentally got duplicated in previous runs or manually
    # We'll just apply the regex replacements. If something already has dark: preceding it, we shouldn't replace it.
    for pattern, new in replacements.items():
        # Match pattern only if it's NOT preceded by 'dark:'
        safe_pattern = r'(?<!dark:)' + pattern
        content = re.sub(safe_pattern, new, content)
        
    # Let's fix the bg-white dark:bg-zinc-900 inside dark: classes just in case
    content = content.replace('dark:bg-white dark:bg-zinc-900', 'dark:bg-zinc-900')
    content = content.replace('dark:bg-gray-50 dark:bg-zinc-950', 'dark:bg-zinc-950')
    content = content.replace('dark:text-gray-900 dark:text-white', 'dark:text-white')

    with open(filepath, 'w') as f:
        f.write(content)

update_file(r'c:\Kamal\Project\HamroCinema\frontend\src\layouts\CustomerLayout.jsx')
update_file(r'c:\Kamal\Project\HamroCinema\frontend\src\pages\customer\Home.jsx')
print("Successfully updated files.")
