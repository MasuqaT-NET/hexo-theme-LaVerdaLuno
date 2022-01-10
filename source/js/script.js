(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200,
    $navSearchButton = $('#nav-search-btn');

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  var setSearch = function () {
    $searchWrap.addClass('on');
    $searchWrap.find('input, button').removeAttr('tabindex');
    $navSearchButton.removeAttr('tabindex');
  };

  var onStartSearch = function () {
    if (isSearchAnim) return;

    startSearchAnim();
    setSearch();
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  };
  $navSearchButton.on('click', onStartSearch);
  $navSearchButton.on('focus', onStartSearch);

  var setDefault = function () {
    $searchWrap.removeClass('on');
    $searchWrap.find('input, button').attr('tabindex', '-1');
    $navSearchButton.attr('tabindex', '0');
  };

  const onEndSearch = function(e){
    if ($.contains($searchWrap[0], e.relatedTarget)) {
      return;
    }
    startSearchAnim();
    setDefault();
    stopSearchAnim();
  };
  $searchWrap.on('focusout', onEndSearch);

  setDefault();

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      title = $this.attr('data-title'),
      encodedTitle = encodeURIComponent(title),
      rootUrl = new URL($('link[rel=canonical]').attr('href')),
      feedUrl = rootUrl.origin + $('link[rel=alternate]').attr('href'),
      encodedFeedUrl = encodeURIComponent(feedUrl),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '" readonly>',
          '<div class="article-share-links">',
            `<a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" class="article-share-twitter" target="_blank" rel="noopener noreferrer" title="Twitter"></a>`,
            `<a href="https://getpocket.com/edit?url=${encodedUrl}" class="article-share-pocket" target="_blank" rel="noopener noreferrer" title="Pocket"></a>`,
            `<a href="https://b.hatena.ne.jp/entry/panel/?url=${encodedUrl}" class="article-share-hatena" target="_blank" rel="noopener noreferrer" title="Hatena"></a>`,
            `<a href="https://feedly.com/i/subscription/feed/${encodedFeedUrl}" class="article-share-feedly" target="_blank" rel="noopener noreferrer" title="Feedly"></a>`,
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox') || $(this).parent().is('a')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" data-fancybox=\"gallery\" data-caption="' + alt + '"></a>')
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });

  $('.archive-year-list-count').on('click', function () {
    $(this).toggleClass("expanded");
  });
})(jQuery);
