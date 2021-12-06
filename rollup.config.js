import svelte from 'rollup-plugin-svelte';
import crypto from 'crypto';
import dev from 'rollup-plugin-dev';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import includePaths from 'rollup-plugin-includepaths';
import css from 'rollup-plugin-css-only';
import html from '@rollup/plugin-html';

let includePathOptions = {
	paths: ['src'],
	extensions: ['.js', '.jsx'],
};

const indexTemplate = ({js, css}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width,initial-scale=1'>
  <title>Forzaboard</title>
  <link rel='icon' type='image/png' href='/favicon.png'>
  <link rel='stylesheet' href='/global.css'>
  ${css}
  <script src='https://unpkg.com/konva@8.3.0/konva.min.js'></script>
  ${js}
</head>
<body>
</body>
</html>
`;

const hashFix = () => {
	return {
		name: 'hash-fix',
		generateBundle(options, bundle) {
			for (const [filename, file] of Object.entries(bundle)) {
				let source = file.code || file.source;
				const [name, suffix] = filename.split('.');
				file.fileName = `bundle/${name}-${crypto.createHash('md5').update(source).digest("hex").slice(0, 8)}.${suffix}`;
			}
		}
	}
}

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		dir: 'public',
	},
	plugins: [
		// hashFix(),
		includePaths(includePathOptions),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			}
		}),

		css({output: 'bundle.css'}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),


		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && dev({
			dirs: ['public'],
			port: 5000,
			proxy: [
				{from: '/api/*', to: 'http://localhost:8000'}
			],
		}),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		hashFix(),
		html({
			fileName: 'index.html',
			template: ({ files}) => {
				const css = files.css.map(file => `<link rel='stylesheet' href='/${file.fileName}'>`).join('\n');
				const js = files.js.map(file => `<script defer src='/${file.fileName}'></script>`).join('\n');
				return indexTemplate({js, css});
			}
		})
	],
	watch: {
		clearScreen: false
	}
};
