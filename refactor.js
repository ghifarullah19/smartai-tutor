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

const cssFiles = findFiles(srcDir, /\.module\.css$/);

let totalReplaced = 0;

for (const cssFile of cssFiles) {
  const tsxFile = cssFile.replace(/\.module\.css$/, '.tsx');
  if (!fs.existsSync(tsxFile)) continue;

  let cssContent = fs.readFileSync(cssFile, 'utf8');
  let tsxContent = fs.readFileSync(tsxFile, 'utf8');

  // Find class blocks that only contain @apply (and maybe disabled states)
  // We'll extract ALL @apply inside any standard class .class-name
  const classRegex = /\.([a-zA-Z0-9_-]+)(?::[a-zA-Z0-9_-]+)?\s*\{\s*@apply\s+([^;]+);\s*\}/g;
  
  let match;
  const classesToInline = {};
  
  while ((match = classRegex.exec(cssContent)) !== null) {
    let className = match[1];
    let applyContent = match[2].replace(/\s+/g, ' ').trim();
    
    // If it's a pseudo-class like .btn:disabled, we prefix utilities with the pseudo-class
    if (match[0].includes(':disabled')) {
      applyContent = applyContent.split(' ').map(c => `disabled:${c}`).join(' ');
    }
    
    if (!classesToInline[className]) classesToInline[className] = [];
    classesToInline[className].push(applyContent);
  }

  let modifiedTsx = tsxContent;
  let modifiedCss = cssContent;

  for (const [className, applyContents] of Object.entries(classesToInline)) {
    const fullApply = applyContents.join(' ');

    // 1. {styles.className}
    modifiedTsx = modifiedTsx.replace(new RegExp(`{\\s*styles\\.${className}\\s*}`, 'g'), `{"${fullApply}"}`);
    // 2. {styles['className']}
    modifiedTsx = modifiedTsx.replace(new RegExp(`{\\s*styles\\['${className}'\\]\\s*}`, 'g'), `{"${fullApply}"}`);
    // 3. ${styles.className}
    modifiedTsx = modifiedTsx.replace(new RegExp(`\\$\\{\\s*styles\\.${className}\\s*\\}`, 'g'), fullApply);
    // 4. ${styles['className']}
    modifiedTsx = modifiedTsx.replace(new RegExp(`\\$\\{\\s*styles\\['${className}'\\]\\s*\\}`, 'g'), fullApply);
    // 5. Bare styles.className
    modifiedTsx = modifiedTsx.replace(new RegExp(`styles\\.${className}(?!\\w)`, 'g'), `"${fullApply}"`);
    // 6. Bare styles['className']
    modifiedTsx = modifiedTsx.replace(new RegExp(`styles\\['${className}'\\]`, 'g'), `"${fullApply}"`);

    // Remove the class block from CSS
    const cssBlockRegex = new RegExp(`\\.${className}(?::[a-zA-Z0-9_-]+)?\\s*\\{\\s*@apply\\s+[^;]+;\\s*\\}`, 'g');
    modifiedCss = modifiedCss.replace(cssBlockRegex, '');
    
    totalReplaced++;
  }

  modifiedCss = modifiedCss.replace(/^\s*[\r\n]/gm, ''); 
  
  if (modifiedTsx !== tsxContent) {
    fs.writeFileSync(tsxFile, modifiedTsx, 'utf8');
  }
  
  if (modifiedCss !== cssContent) {
    fs.writeFileSync(cssFile, modifiedCss, 'utf8');
  }
}

console.log(`Successfully replaced ${totalReplaced} @apply rules.`);
