# LaVerdaLuno

A hexo theme for my blog [LaVerdaLuno](https://blog.masuqat.net/). 

## Installation

### Install

``` bash
$ git clone --depth 1 https://github.com/MasuqaT-NET/hexo-theme-LaVerdaLuno.git themes/LaVerdaLuno
```

**Theme LaVerdaLuno requires Hexo 2.4 and above.** If you would like to enable the RSS, the [hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed) plugin is also required.

### Enable

Modify `theme` setting in `_config.yml` to `LaVerdaLuno`.

``` diff
_config.yml
- theme: some-theme
+ theme: LaVerdaLuno
```

### Update

``` bash
cd themes/LaVerdaLuno
git pull
```

## Configuration

``` yml
# Header
menu:
  Home: /
  Archives: /archives
rss: /atom.xml
banner: images/banner.jpg

# Content
excerpt_link: Read More
fancybox: true
recent_posts_limits: 5

# Sidebar
sidebar: right
widgets:
- category
- tag
- tagcloud
- archives
- recent_posts

# Miscellaneous
google_analytics:
favicon: /favicon.png
twitter:
```

- **menu** - Navigation menu
- **rss** - RSS link
- **banner** - Path of title banner image of page top
- **excerpt_link** - "Read More" link at the bottom of excerpted articles. `false` to hide the link.
- **fancybox** - Enable [Fancybox]
- **recent_posts_limits** - How many posts display in Home page.
- **sidebar** - Sidebar style. You can choose `left`, `right`, `bottom` or `false`.
- **widgets** - Widgets displaying in sidebar
- **google_analytics** - Google Analytics ID
- **favicon** - Favicon path
- **twitter** - Twiiter ID

## Features

### Taqs

#### Fancybox

LaVerdaLuno uses [Fancybox] to showcase your photos. You can use Markdown syntax or fancybox tag plugin to add your photos.

```
![img caption](img url)

{% fancybox [html class] img_url [img_thumbnail] [img_caption] %}
```

#### Advent Calender

```
{% __advent_calender <calender title> <calender url> <day of this article> | [<yesterday title> <yesterday url>] | [<tomorrow title> <tomorrow url>] %}
```

#### Gorgeous Quote

```
{% __gorgeous_quote <title> | <subtitle> | [author[, source]] [link] [source_link_title] %}
Quote string
{% end__gorgeous_quote %}
```

#### KaTeX server-side rendering Math

##### Inline Math

```
{%m <math>%}
```

##### Display Math

```
{% md %}
<math>+
{% endmd %}
```

#### Muted Text

```
{%__muted%}<markdown text>{%end__muted%}
```

#### Reference

```
{% __reference %}
+ [Link](url)
...
{% end__reference %}
```

#### Slideshare

```
{% __slideshare <embed code> %}
```

### Sidebar

You can put your sidebar in left side, right side or bottom of your site by editing `sidebar` setting.

Landscape provides 5 built-in widgets:

- category
- tag
- tagcloud
- archives
- recent_posts

All of them are enabled by default. You can edit them in `widget` setting.

[Fancybox]: https://github.com/fancyapps/fancyBox
