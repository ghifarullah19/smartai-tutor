const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const tsxFiles = findFiles(srcDir, /\.tsx$/);

for (const tsxFile of tsxFiles) {
  let tsxContent = fs.readFileSync(tsxFile, 'utf8');
  if (!tsxContent.includes('styles')) {
     tsxContent = tsxContent.replace(/import\s+styles\s+from\s+['"]\.\/.*?\.module\.css['"];?\r?\n?/g, '');
     fs.writeFileSync(tsxFile, tsxContent, 'utf8');
  } else {
     // If it still contains 'styles' but it's just the import? Let's check regex matching whole words
     if (!/\bstyles\./.test(tsxContent) && !/\bstyles\[/.test(tsxContent)) {
       tsxContent = tsxContent.replace(/import\s+styles\s+from\s+['"]\.\/.*?\.module\.css['"];?\r?\n?/g, '');
       fs.writeFileSync(tsxFile, tsxContent, 'utf8');
     }
  }
}
console.log('Done removing unused styles imports');
