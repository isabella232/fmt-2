#!/usr/bin/env node

console.error('⚠ mongodb-js-fmt has been sunset!');
console.error('  Please read: https://github.com/mongodb-js/fmt');
console.error(`
---
If you're seeing this message, it's because your module is still using 'mongodb-js-fmt' which has been sunset. It no longer is, it was. :)

mongodb-js-fmt never even made it to a minor release, but it snuck into lots of project templates so I'm including this message to help cleanup.

Here's how to make this go away:

1. Remove \`"fmt": "mongodb-js-fmt"\` from \`"scripts"\` in your package.json
2. npm uninstall --save-dev mongodb-js-fmt
3. Install prettier for the IDE/Editor of your choice: https://prettier.io/docs/en/editors.html
4. If you see \`"mongodb-js-fmt": "0.0.3"\` in a friend's \`package.json\`, send them a PR or this link https://github.com/mongodb-js/fmt
`);
