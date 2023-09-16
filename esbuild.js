import { copyFile, readFile, rm } from 'node:fs/promises';

import { build } from 'esbuild';
import { watch } from 'chokidar';
import express from 'express';

import tailwindcss from 'tailwindcss';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';

const env = process.argv[2].replace(/^--/, '');
const mode = process.argv[3].replace(/^--/, '');

class Compiler {
    constructor() {
        this.lastRequest = '';
        this.postcssPlugin = {
            name: 'postcss',
            setup: (build) => {
                build.onLoad({ filter: /.\.css$/ }, async (args) => {
                    const css = await readFile(args.path, { encoding: 'utf-8' });
                    const result = await postcss([
                        postcssImport(),
                        tailwindcss({ config: './tailwind.config.js' }),
                        autoprefixer()
                    ])
                        .process(css, { from: args.path })

                    return {
                        loader: 'css',
                        contents: result.css
                    }
                })
            }
        }
    }

    timestamp() {
        return new Date().toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    async banner() {
        if (env === 'dev') {
            const [metadata, cssLoader] = await Promise.all([
                readFile('./static/metadata.dev.txt', 'utf-8'),
                readFile('./static/css-loader.js', 'utf-8')
            ])
            const version = `// @version         ${Date.now()}`;
            return `${metadata.replace(/^\/\/\s@version.*/gm, version)}\n\n${cssLoader}\n\n`;
        }
        else {
            const [metadata, pkgJson] = await Promise.all([
                readFile('./static/metadata.prod.txt', 'utf-8'),
                readFile('./package.json', 'utf-8')
            ])

            const version = `// @version         ${JSON.parse(pkgJson).version}`;
            return `${metadata.replace(/^\/\/\s@version.*/gm, version)}\n\n`
        }
    }

    async jsConfig() {
        return env === 'dev'
            ? {
                define: { 'process.env.NODE_ENV': '"development"' },
                minify: false,
                target: 'esnext',
                outfile: './dist/script.dev.user.js',
                banner: {
                    js: await this.banner()
                }
            }
            : {
                define: { 'process.env.NODE_ENV': '"production"' },
                minify: true,
                target: 'es2020',
                outfile: './dist/script.user.js',
                banner: {
                    js: await this.banner()
                }
            }
    }

    cssConfig() {
        return env === 'dev'
            ? {
                outfile: './dist/style.dev.user.css',
                minify: false,
            }
            : {
                outfile: './dist/style.user.css',
                minify: true,
            }
    }

    async cleanDir() {
        try {
            await rm('./dist', { recursive: true });
        } catch (error) {
            if (error.code === 'ENOENT') { return };
            throw error;
        }
    }

    async buildScript() {
        await build({
            entryPoints: ['./src/index.tsx'],
            bundle: true,
            jsx: 'automatic',
            platform: 'browser',
            format: 'iife',
            logLevel: 'info',
            ...await this.jsConfig()
        });
    }

    async buildCss() {
        await build({
            entryPoints: ['./src/css/tailwind.css'],
            bundle: true,
            logLevel: 'warning',
            plugins: [this.postcssPlugin],
            ...this.cssConfig()
        });
    }

    async copyLogo() {
        await copyFile('static/script.png', 'dist/script.png');
    }

    serve() {
        const app = express();

        app.use((req, res, next) => {
            if (this.lastRequest !== req.path) {
                this.lastRequest = req.path;
                console.log(`[${this.timestamp()}] ${req.path}`);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        });

        app.use('/dist', express.static('dist'));

        app.listen(5000, () => {
            console.log(`  http://localhost:5000/dist/script${env === 'dev' ? '.dev' : ''}.user.js`);
        });
    }

    async watch() {
        watch('./src/**/*.*', { persistent: true })
            .on('change', async (event) => {
                await Promise.all([
                    this.buildScript(),
                    this.buildCss(),
                ]);
                this.copyLogo()
            })
    }

    async build() {
        await Promise.all([
            this.buildScript(),
            this.buildCss(),
        ]);
        this.copyLogo()
    }
}

const compiler = new Compiler();

if (mode === 'watch') {
    compiler.serve();

    await compiler.cleanDir();
    await compiler.build();
    await compiler.watch();
}

if (mode === 'build') {
    await compiler.cleanDir();
    await compiler.build();
}