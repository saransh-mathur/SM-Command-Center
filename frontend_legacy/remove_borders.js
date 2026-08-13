const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the class "border" when surrounded by spaces, quotes, or backticks.
    // This avoids breaking things like "border-b", "border-slate-800", etc.
    // Wait, some divs might just rely on "border-slate-800" without the "border" class to define color, 
    // but in Tailwind, without the base "border" class (which applies border-width: 1px), 
    // the colored border classes won't show anything anyway. 
    // Let's also remove border colors that give the white outline look, like border-white/10, border-slate-[700|800]
    
    let newContent = content.replace(/(?<=[\s"'\`])border(?=[\s"'\`])/g, '');
    
    // Also remove any explicit border-white/x or border-slate-x or border-zinc-x that could act as outlines
    newContent = newContent.replace(/(?<=[\s"'\`])border-(?:white|slate-[0-9]{3}|zinc-[0-9]{3})(?:\/[0-9]+)?(?=[\s"'\`])/g, '');

    // Cleanup double spaces created by removal
    newContent = newContent.replace(/  +/g, ' ');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Removed outlines from', filePath);
    }
  }
});
