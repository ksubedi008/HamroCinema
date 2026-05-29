const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content.replace(/'http:\/\/localhost:8000([^']*)'/g, '`${import.meta.env.VITE_API_BASE_URL}$1`');
            newContent = newContent.replace(/"http:\/\/localhost:8000([^"]*)"/g, '`${import.meta.env.VITE_API_BASE_URL}$1`');
            newContent = newContent.replace(/`http:\/\/localhost:8000([^`]*)`/g, '`${import.meta.env.VITE_API_BASE_URL}$1`');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Updated', fullPath);
            }
        }
    }
}

replaceInDir('c:/Kamal/Project/HamroCinema/frontend/src');
