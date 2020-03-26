'use strict';

var cheerio = require('cheerio');
var codeHighlightSelector = 'figure.highlight';

hexo.extend.filter.register('after_post_render', function (data) {
  var $ = cheerio.load(data.content, {decodeEntities: true});

  var highlights = $(codeHighlightSelector);

  // marked
  highlights.each(function () {
    var /** @type {number[]} */ markedIndices = [];
    var hl = this;
    $(hl).find('.code .line').each(function (index) {
      if ($(this).hasClass('marked')) {
        markedIndices.push(index);
      }
    });
    markedIndices.forEach(function (index) {
      $($(hl).find('.gutter pre .line:nth-of-type(' + (index + 1) + ')')[0]).addClass('marked');
    });
  });

  // for Rust
  highlights.filter(function () {
    return $(this).hasClass('rust');
  }).each(function () {
    // macro
    $(this).find('.built_in').filter(function () {
      var name = $(this).html();
      return name[name.length - 1] === '!';
    }).each(function () {
      $(this).removeClass('built_in');
      $(this).addClass('macro');
    });
  });

  // for XML & XAML
  highlights.filter(function () {
    return $(this).hasClass('xml');
  }).each(function () {
    // explicit namespace on name in tag
    $(this).find('.tag > .name').filter(function () {
      var name = $(this).html();
      return name[0] !== ':' && name[name.length - 1] !== ':' && name.indexOf(':') >= 0;
    }).each(function () {
      var prevName = $(this).html();
      var buf = prevName.split(':');
      var name = $('<span class="identifier">').append(':' + buf.pop());
      var ns = $('<span class="ns">').append(buf.join(":"));
      $(this).empty();
      $(this).append(ns).append(name);
    });

    // explicit namespace on attr in tag or xmlns definition
    $(this).find('.tag > .attr').filter(function () {
      var name = $(this).html();
      return name[0] !== ':' && name[name.length - 1] !== ':' && name.indexOf(':') >= 0;
    }).each(function () {
      var prevName = $(this).html();
      if (prevName.indexOf('xmlns:') === 0) { // xml namespace definition
        var keyword = $('<span class="xmlns-keyword">').append('xmlns:');
        var defNs = $('<span class="xmlns-name">').append(prevName.substr(6));
        $(this).empty();
        $(this).append(keyword).append(defNs);
      } else { // explicit namespace
        var buf = prevName.split(':');
        var name = $('<span class="identifier">').append(':' + buf.pop());
        var ns = $('<span class="ns">').append(buf.join(":"));
        $(this).empty();
        $(this).append(ns).append(name);
      }
    });

    // xml def tag
    $(this).find('.line').filter(function () {
      var content = $(this).html();
      return content.substr(0, 8) === '&lt;?xml' && content.substr(content.length - 5) === '?&gt;' // escaped
    }).each(function () {
      var content = $(this).html();
      var actualContent = content.substr(5, content.length - 10);
      $(this).empty();
      $(this)
          .append($('<span class="xml-def-keyword">').append('&lt;?'))
          .append(actualContent)
          .append($('<span class="xml-def-keyword">').append('?&gt;'));
    });
  });

  // for HTML
  highlights.filter(function () {
    return $(this).hasClass('html');
  }).each(function () {
    // macro
    $(this).find('.tag').each(function () {
      var tagStr = $(this).html();
      var m;
      while (m = /<span class="attr">.*?<\/span>=<span class="string">/.exec(tagStr)) {
        var mm = m[0].match(/<\/span>=<span/);
        tagStr = tagStr.substring(0, m.index + mm.index + 7) + "<span class='eq'>=</span>" + tagStr.substring(m.index + mm.index + 7 + 1);
      }
      $(this).empty();
      $(this).append(tagStr);
      $(this).append
    });
  });

  // for yaml
  highlights.filter(function () {
    return $(this).hasClass('yaml');
  }).each(function () {
    // attribute
    $(this).find('.attr').each(function () {
      var attrStr = $(this).html();
      if (attrStr.endsWith(":")) {
        attrStr = attrStr.slice(0, -1);
        $(this).after(":")
      }
      $(this).empty();
      $(this).append(attrStr);
    });

    // value
    $(this).find('.string').each(function () {
      var valueStr = $(this).html();
      if ((valueStr.startsWith('&apos;') && valueStr.endsWith('&apos;')) || valueStr.startsWith('&quot;') && valueStr.endsWith('&quot;')) {
        $(this).removeClass('string').addClass('quoted-string');
      }
    })
  });

  data.content = $('body').html();
});
