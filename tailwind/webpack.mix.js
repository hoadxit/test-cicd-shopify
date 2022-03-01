const mix = require('laravel-mix');
const purgecss = require('laravel-mix-purgecss');

mix.postCss('./assets/tailwind-2.2.19.min.css', '../assets/tailwind-2.2.19.min.css', [])

if (mix.inProduction()) {
  mix.purgeCss({
    folders: [
      '../layout',
      '../sections',
      '../snippets',
      '../templates',
    ],
    extensions: ['js', 'json', 'liquid'],
  }).options({
    cssNano: {
      discardComments: {removeAll: true},
    }
  });
}
