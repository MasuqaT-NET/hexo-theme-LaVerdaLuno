'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Inline SVG tag
 * Syntax:
 *   {%inline_svg [kind=plantuml] /path/to/image [title] %}
 */
function is_wrap(ctx) {
    return function inlineSvgTag(args) {
        let kind = "";
        if (!args[0].startsWith("/")) {
            kind = args.shift();
        }
        const [svgFileName, caption] = args;

        const svgDir = path.join(ctx.source_dir, svgFileName);
        // return fs.readFileSync()
        if (!fs.existsSync(svgDir)) {
            throw new Error(`SVG file "${svgFileName}" doesn't exists.`);
        }

        const rawSvg = fs.readFileSync(svgDir).toString();

        const $ = cheerio.load(rawSvg, {xmlMode: true});
        const svg = $('svg');

        if (kind === "plantuml") {
            plantUmlProcess(svg);
        }

        const wrapper = $(`<div class="fancybox-tag inline-svg ${kind}"></div>`);
        const anchor = $(`<a data-fancybox="gallery" href="${svgFileName}" data-caption="${caption}"></a>`);
        const title = $(`<span class="caption">${caption}</span>`);

        svg.wrap(anchor);
        anchor.wrap(wrapper);
        if (caption) anchor.after(title);

        // remove comments
        $.root().find('*').contents().filter(function () {
            return this.type === 'comment';
        }).remove();

        return wrapper;
    }
}

/**
 * @param svg {Cheerio}
 */
function plantUmlProcess(svg) {
    // TODO add metadata from comment
    // grouping with comment separation
    //
    // <!--MD5=[...] class Hoge -->
    // <rect />
    // <path />
    // <!--MD5=[...] entity Fuga -->
    //
    // to
    //
    // <g data-kind="class" data-name="Hoge" />
    // <g data-kind="entity" data-name="Fuga" />
}

hexo.extend.tag.register('inline_svg', is_wrap(hexo));
