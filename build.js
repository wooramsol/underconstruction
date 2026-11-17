// Pre-renders the main page project list into index.html (for SEO & link previews).
// Run after editing projectData:   node build.js
const fs = require('fs');
const file = __dirname + '/index.html';
let html = fs.readFileSync(file, 'utf8');
const i = html.lastIndexOf('<script>');
const js = html.slice(i + 8, html.indexOf('</script>', i));
const pick = (re, name) => { const m = js.match(re); if (!m) throw new Error('not found: ' + name); return m[0]; };
const code = [
  pick(/const projectData = \[[\s\S]*?\n        \];/, 'projectData'),
  pick(/const THUMBS = \{[\s\S]*?\n        \};/, 'THUMBS'),
  pick(/function imgSrc[\s\S]*?\n        }\n/, 'imgSrc'),
  pick(/function imgSizeAttrs[\s\S]*?\n        }\n/, 'imgSizeAttrs'),
  pick(/function mediaTag[\s\S]*?\n        }\n/, 'mediaTag'),
  pick(/function projectsHTML[\s\S]*?\n        }\n/, 'projectsHTML'),
  pick(/function dataHash[\s\S]*?\n        }\n/, 'dataHash'),
].join('\n');
const { out, hash } = new Function(code + '\nreturn { out: projectsHTML(), hash: dataHash() };')();
html = html.replace(/<main id="project-container" data-build="[^"]*"><!-- PROJECTS:START -->[\s\S]*?<!-- PROJECTS:END --><\/main>/,
  `<main id="project-container" data-build="${hash}"><!-- PROJECTS:START -->${out}<!-- PROJECTS:END --></main>`);
fs.writeFileSync(file, html);
console.log('index.html: pre-rendered', (out.match(/class="project-item"/g) || []).length, 'projects, hash', hash);
