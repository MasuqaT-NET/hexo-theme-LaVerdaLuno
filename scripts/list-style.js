'use strict';

/**
 * Changing list-style tag
 * Syntax:
 *   {% __list_style <style> %}
 *   1. a
 *   2. a
 *   {% end__list_style %}
 */
function ls_wrap(ctx) {
    return function listStyleTag(args, content) {
        if (args.length !== 1) {
            throw Error("Invalid argument.");
        }

        var renderedText = ctx.render.renderSync({text: content, engine: 'markdown'});
        if (renderedText.lastIndexOf('<ul>', 0) === 0 && renderedText.indexOf('</ul>\n', renderedText.length - 6) >= 0) {
            return '<ul style="list-style: ' + args[0] + ';">' + renderedText.substring(4); // `<ul>hoge ABC</ul>\n` -> `<ul style="list-style: ????;">hoge ABC</ul>`
        } else if (renderedText.lastIndexOf('<ol>', 0) === 0 && renderedText.indexOf('</ol>\n', renderedText.length - 6) >= 0) {
            return '<ol style="list-style: ' + args[0] + ';">' + renderedText.substring(4); // `<ol>hoge ABC</ul>\n` -> `<ol style="list-style: ????;">hoge ABC</ul>`
        } else {
            throw Error("Invalid usage.");
        }
    }
}

hexo.extend.tag.register('__list_style', ls_wrap(hexo), {ends: true});
