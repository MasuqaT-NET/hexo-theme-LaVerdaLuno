/**
 * SlideShare tag
 *
 * Syntax:
 *   {% __slideshare <embed code> %}
 */
function s_wrap(ctx) {
    return function slideshareTag(args) {
        if (args.length !== 1) {
            throw new Error("Only 1 argument is allowed.");
        }
        const code = args.shift();
        const slideshareConfig = ctx.config.slideshare || {};
        const width = slideshareConfig.width || 599;
        const height = slideshareConfig.height || 487;
        return '<iframe src="//www.slideshare.net/slideshow/embed_code/key/' + code + '" width="' + width + '" height="' + height + '"'
            + ' frameborder="0" marginwidth="0" marginheight="0" scrolling="no" class="slideshare" allowfullscreen> </iframe>';
    };
}

hexo.extend.tag.register('__slideshare', s_wrap(hexo));