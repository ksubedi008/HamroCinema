import os
import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # The exact reverse mapping of what we did
    replacements = {
        'bg-white dark:bg-zinc-900': 'bg-zinc-900',
        'bg-gray-50 dark:bg-zinc-950': 'bg-zinc-950',
        'bg-gray-200 dark:bg-stone-900': 'bg-stone-900',
        'bg-gray-50 dark:bg-stone-950': 'bg-stone-950',
        'border-gray-200 dark:border-zinc-800': 'border-zinc-800',
        'border-gray-300 dark:border-stone-800': 'border-stone-800',
        
        'text-gray-900 dark:text-white': 'text-white',
        'text-gray-900 dark:text-zinc-100': 'text-zinc-100',
        'text-gray-800 dark:text-gray-200': 'text-gray-200',
        'text-gray-700 dark:text-gray-300': 'text-gray-300',
        'text-gray-600 dark:text-gray-400': 'text-gray-400',
        'text-gray-700 dark:text-zinc-300': 'text-zinc-300',
        'text-gray-600 dark:text-zinc-400': 'text-zinc-400',
        'text-gray-500 dark:text-zinc-500': 'text-zinc-500',
        'text-gray-700 dark:text-stone-300': 'text-stone-300',
        'text-gray-600 dark:text-stone-400': 'text-stone-400',
        'text-gray-500 dark:text-stone-500': 'text-stone-500',
        
        'hover:text-gray-900 dark:hover:text-white': 'hover:text-white',
        'hover:text-gray-900 dark:hover:text-gray-300': 'hover:text-gray-300',
        
        'from-white dark:from-stone-950': 'from-stone-950',
        'to-white/90 dark:to-stone-950/90': 'to-stone-950/90',
        'from-gray-300/50 dark:from-stone-800/50': 'from-stone-800/50',
        'to-gray-100 dark:to-stone-950': 'to-stone-950',
        'via-gray-50/80 dark:via-stone-950/80': 'via-stone-950/80',
        'to-gray-50/20 dark:to-stone-950/20': 'to-stone-950/20',
        
        'hover:bg-gray-100 dark:hover:bg-white/20': 'hover: hover:/20', # Put it back to how it was originally
        
        # Specific fixes for the wrapper
        'bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-white': 'bg-[#121212] text-white',
        'bg-gray-50 dark:bg-[#121212]': 'bg-[#121212]',
        
        # In Home.jsx
        'bg-gradient-to-t from-white to-white/90 dark:from-stone-950 dark:to-stone-950/90': 'bg-gradient-to-t from-stone-950 to-stone-950/90',
        'bg-gradient-to-br from-amber-100/30 to-gray-200 dark:from-amber-900/30 dark:to-stone-950': 'bg-gradient-to-br from-amber-900/30 to-stone-950',
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(filepath, 'w') as f:
        f.write(content)

update_file(r'c:\Kamal\Project\HamroCinema\frontend\src\layouts\CustomerLayout.jsx')
update_file(r'c:\Kamal\Project\HamroCinema\frontend\src\pages\customer\Home.jsx')
print("Successfully reverted UI files.")
