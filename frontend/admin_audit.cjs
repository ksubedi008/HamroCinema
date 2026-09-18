const fs = require('fs');
const path = require('path');
const ADMIN_DIR = 'src/pages/admin';
const LAYOUT_FILE = 'src/layouts/AdminLayout.jsx';

const replacements = [
  { p: /bg-purple-900\/20/g, r: 'bg-[#1A1A1A]' },
  { p: /divide-purple-900\/20/g, r: 'divide-neutral-800' },
  { p: /divide-zinc-800/g, r: 'divide-neutral-800' },
  { p: /bg-stone-800/g, r: 'bg-neutral-800' },
  { p: /bg-cyan-500\/20/g, r: 'bg-[#1A1A1A]' },
  { p: /bg-green-500\/20/g, r: 'bg-[#1A1A1A]' },
  { p: /bg-yellow-500\/20/g, r: 'bg-[#1A1A1A]' },
  { p: /bg-gray-500\/20/g, r: 'bg-[#1A1A1A]' },
  { p: /bg-red-500\/10/g, r: 'bg-[#1A1A1A]' },
  { p: /bg-pink-500\/10/g, r: 'bg-[#1A1A1A]' },
  { p: /bg-blue-500\/10/g, r: 'bg-[#1A1A1A]' },
  { p: /bg-amber-700/g, r: 'bg-white text-black' },
  { p: /bg-amber-500/g, r: 'bg-white text-black' },
  { p: /text-zinc-100/g, r: 'text-neutral-100' },
  { p: /text-zinc-500/g, r: 'text-neutral-400' },
  { p: /text-amber-500/g, r: 'text-neutral-100' },
  { p: /text-amber-400/g, r: 'text-neutral-100' },
  { p: /text-\[#050b14\]/g, r: 'text-black' },
  { p: /border-amber-500/g, r: 'border-neutral-100' },
  { p: /border-amber-700\/50/g, r: 'border-neutral-600' },
  { p: /border-transparent hover:border-neutral-500/g, r: 'border-transparent hover:border-neutral-600' },
  { p: /border-red-500\/20/g, r: 'border-neutral-800' },
  { p: /border-green-500\/20/g, r: 'border-neutral-800' },
  { p: /border-blue-500\/20/g, r: 'border-neutral-800' },
  { p: /border-transparent hover:border-red-500\/30/g, r: 'border-transparent hover:border-neutral-800' },
  { p: /border-green-500\/30/g, r: 'border-neutral-800' },
  { p: /border-gray-500\/30/g, r: 'border-neutral-800' },
  
  // Hovers
  { p: /hover:bg-\[#1A1A1A\]\/50/g, r: 'hover:bg-neutral-800' },
  { p: /hover:bg-\[#1A1A1A\]/g, r: 'hover:bg-neutral-800' },
  { p: /hover:bg-pink-400\/10/g, r: 'hover:bg-neutral-800' },
  { p: /hover:bg-red-500\/10/g, r: 'hover:bg-neutral-800' },
  { p: /hover:bg-red-400\/10/g, r: 'hover:bg-neutral-800' },
  
  // Scaling and Transforms
  { p: /hover:scale-105/g, r: '' },
  { p: /hover:-translate-y-1/g, r: '' },
  
  // Specific wording
  { p: /window\.confirm\('Are you sure you want to delete this movie\? This action cannot be undone\.'\)/g, r: "window.confirm('Confirm deletion of movie record? This action cannot be undone.')" },
  { p: /window\.confirm\('Are you sure you want to cancel this showtime\?'\)/g, r: "window.confirm('Confirm cancellation of showtime? This action cannot be undone.')" },
  { p: /alert\('Failed to delete movie\.'\)/g, r: "alert('Failed to delete movie record. Please try again.')" }
];

function processFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  
  replacements.forEach(({p, r}) => {
    content = content.replace(p, r);
  });
  
  if (original !== content) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Updated:', path.basename(filepath));
  } else {
    console.log('No changes:', path.basename(filepath));
  }
}

fs.readdirSync(ADMIN_DIR).forEach(file => {
  if (file.endsWith('.jsx')) processFile(path.join(ADMIN_DIR, file));
});
processFile(LAYOUT_FILE);
