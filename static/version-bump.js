import { readFile, writeFile } from 'node:fs/promises';

try {
    const version = process.argv.find(arg => /^--version=\d{1,5}\.\d{1,5}\.\d{1,5}/.test(arg)).split('=').at(1);
    const userscript = await readFile('./dist/script.user.js', 'utf-8');
    const update = userscript.replace(/^\/\/\s@version.*/gm, `// @version         ${version}`);

    await writeFile('./dist/script.user.js', update, 'utf-8');

    console.log(`🔥 Userscript before:bump hook updated version to: ${version}`);
} catch (error) {
    console.error('version-bump.js - bumping version failed');
    console.error(error);
    process.exit(1);
}