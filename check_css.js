
const fs = require('fs');
const content = fs.readFileSync('app/(app)/shop.css', 'utf8');
let open = 0;
for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') open++;
    if (content[i] === '}') open--;
    if (open < 0) {
        console.log('Error: Unexpected closing brace at index ' + i);
        break;
    }
}
if (open > 0) console.log('Error: ' + open + ' unclosed braces');
else if (open === 0) console.log('Braces are balanced');
