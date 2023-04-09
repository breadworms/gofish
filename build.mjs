import * as fs from 'fs';
import { basename } from 'path';
import { minify } from 'uglify-js';

const tsconfig = JSON.parse(fs.readFileSync('./src/tsconfig.json', 'utf8'));
const commands = tsconfig.references.map((reference => basename(reference.path)));

for (const command of commands) {
  const contents = fs.readFileSync(`./dist/${command}.js`, 'utf8')
    .replaceAll(`'🟦'`, '__empty')
    + 'const __empty = false;';

  const res = minify(contents, {
    mangle: {
      toplevel: true,
      reserved: ['main']
    }
  });

  if (res.error) {
    throw res.error;
  }

  if (res.warnings) {
    console.log(res.warnings);
  }

  fs.writeFileSync(`./dist/${command}.min.js`, res.code);
}
