'use strict';

const marked = require('marked');
const renderer = new marked.Renderer();
const RX_TEMPLATE = /^<!--\s*#(.+?)\s*-->\n$/g;

let closeTemplate = false;
let section = '';

const template = (_, tpl) => {
  closeTemplate = true;
  return `<div class="template template-${tpl}">\n`;
}

renderer.html = html => html.replace(RX_TEMPLATE, template);

renderer.heading = (text, level) => {
  if (level === 1) {
    section = text;
  }

  if (!section || level !== 2) {
    return `<h${level}>${text}</h${level}>\n`;
  }

  return `<h2>\n<span class="reminder">${section}</span>\n${text}\n</h2>\n`;
};

renderer.hr = () => {
  if (closeTemplate) {
    closeTemplate = false;
    return '</div>\n</section>\n<section>\n';
  }

  return '</section>\n<section>\n';
};

const defaultHeader = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
*, *::before, *::after { box-sizing: inherit }
html { box-sizing: border-box }
body { counter-reset: page; font: 4vw 'Helvetica Neue', sans-serif; margin: 0; scroll-snap-type: mandatory; scroll-snap-destination: 100% 0%; scroll-snap-points-y: repeat(100%) }
html, body, section, .template { height: 100% }
section { display: flex; flex-direction: column; page-break-before: always; position: relative; scroll-snap-align: start }
section::after { bottom: 1em; color: #c0392b; content: counter(page); counter-increment: page; font-size: .5em; position: absolute; right: 2.25em }
section > *, .template > * { margin: auto 0; padding: 0 1.125em }
h1, h2 { background: #c0392b; color: #fff; font-weight: 100; font-size: 1.5em; margin: 0 !important; padding: .25em .75em !important }
blockquote { font-style: italic }
cite { display: block; font-size: .9em; font-variant: small-caps; margin-top: .5em; text-align: right }
cite::before { content: '\\2014  ' }
ol, ul { line-height: 1.5; list-style-position: inside; margin: auto 0 }
ul { list-style-type: none }
ul > li::before { color: #c0392b; content: '</> ' }
pre { font-size: .66em; padding: 0 1.704em }
table { table-layout: fixed; text-align: center; width: 100% }
th { border-bottom: .125em solid #c0392b; font-variant: small-caps; font-weight: normal; }
strong { color: #c0392b; font-weight: inherit }

.template { display: flex; flex-direction: column; padding: 0 }
.reminder { display: block; font-size: .5em }

.template-title, .template-section { background: #c0392b; color: #fff }
.template-title > :first-child, .template-section > :first-child { margin: auto auto 0 !important }
.template-title > :last-child, .template-section > :last-child { margin: 0 auto auto !important }
.template-title > h1 { font-size: 2.5em }
.template-title > p { font-size: 1.2em; font-weight: 100; text-transform: uppercase }

.template-summary a { color: inherit; text-decoration: inherit }

.template-section > blockquote { font-size: .8em; font-weight: 100; padding-top: 1em }
.template-section > blockquote > p { margin: 0 }

.template-inline-list > ul { margin: auto !important }
.template-inline-list > ul > li { align-items: center; display: flex; justify-content: center }
.template-inline-list > ul > li::before { content: none }
.template-inline-list > ul > li > ul { border-left: .125em solid #c0392b; margin: 0 1em; padding: .25em 1em }
.template-inline-list > ul > li > ul > li::before { content: none }

.template-big-image > p { align-items: center; flex: 1; overflow: hidden; padding: 0 }
.template-big-image > p > img { display: block; margin: auto; max-height: 100%; max-width: 100% }

.template-multi-list > ul { display: flex; font-size: .8em; margin: auto !important; width: 100% }
.template-multi-list > ul > li { display: flex; flex: 1 }
.template-multi-list > ul > li::before { content: none }
.template-multi-list > ul > li > ul { margin: 0; padding: 0 }
.template-multi-list > ul > li > ul > li::before { content: none }

.template-illustration > ul { display: flex; margin: auto !important; padding:0; width: 100% }
.template-illustration > ul > li { display: flex; flex: 1 }
.template-illustration > ul > li > img { display: block; margin: auto; max-height: 100%; max-width: 100% }
.template-illustration > ul > li::before { content: none }
.template-illustration > ul > li > ul { margin: auto 0; padding: 0 }

.fullscreen { display: none }

@media screen {
  .fullscreen { background: #fff; border: 0; border-radius: 2px; bottom: 2em; color: #c0392b; cursor: pointer; display: block; font: inherit; font-size: .25em; left: 4.5em; opacity: .3; padding: .25em .5em; position: absolute; text-transform: uppercase; transition: .3s opacity }
  .fullscreen:hover { opacity: 1 }
}
</style>
</head>
<body>
<section>\n`;

const defaultFooter = `</section>
<button class="fullscreen" onclick="document.documentElement.mozRequestFullScreen()">fullscreen</button>
</body>
</html>\n`;

function ardent(markdown, {
  header = defaultHeader,
  footer = defaultFooter,
} = {}) {
  return header + marked(markdown, { renderer }) + (closeTemplate ? '</div>\n' : '') + footer;
}

module.exports = ardent;
