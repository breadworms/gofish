import * as fs from 'fs';
import { minify } from 'uglify-js';

const contents = fs.readFileSync('./dist/gofish.js', 'utf8')
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

fs.writeFileSync('./dist/gofish.min.js', res.code);
