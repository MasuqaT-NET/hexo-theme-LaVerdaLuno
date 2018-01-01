'use strict';

function foldListArchivesHelper(options) {
    options = options || {};

    var config = this.config;
    var archiveDir = config.archive_dir;
    var timezone = config.timezone;
    var lang = this.page.lang || this.page.language || config.language;
    var style = options.hasOwnProperty('style') ? options.style : 'list';
    var showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
    var transform = options.transform;
    var separator = options.hasOwnProperty('separator') ? options.separator : ', ';
    var className = options.class || 'archive';
    var order = options.order || -1;
    var result = '';
    var self = this;

    var posts = this.site.posts.sort('date', order);
    if (!posts.length) return result;

    /**
     * @typedef {Data}
     * @property {number} year
     * @property {string} yearName
     * @property {number} month
     * @property {string} monthName
     * @property {number} count
     */
    var /** @type {Data[][]} */ data = [];
    posts.forEach(function (post) {
        // Clone the date object to avoid pollution
        var date = post.date.clone();

        if (timezone) date = date.tz(timezone);
        if (lang) date = date.locale(lang);

        var year = date.year();
        var yearName = date.format('YYYY') + (date.locale() === 'ja' ? '年' : '');
        var month = date.month() + 1;
        var monthName = date.format('MMM');
        var lastDataOfYear = data[data.length - 1];
        if (lastDataOfYear && lastDataOfYear[0].year === year) { // year exists
            var lastDataOfMonth = lastDataOfYear[lastDataOfYear.length - 1];
            if (lastDataOfMonth && lastDataOfMonth.month === month) { // month exists
                lastDataOfMonth.count++;
            } else {
                lastDataOfYear.push({year: year, yearName: yearName, month: month, monthName: monthName, count: 1});
            }
        } else {
            data.push([{year: year, yearName: yearName, month: month, monthName: monthName, count: 1}]);
        }
    });

    if (style === 'list') {
        result += '<ul class="' + className + '-year-list">';

        data.forEach(function (dataOfYear) {
            result += '<li class="' + className + '-year-list-item">';
            result += '<a class="' + className + '-year-list-link" href="' + self.url_for(archiveDir + '/' + dataOfYear[0].year + '/') + '">';
            result += transform ? transform(dataOfYear[0].yearName) : dataOfYear[0].yearName;
            result += '</a>';
            result += '<span class="' + className + '-year-list-count" tabindex="0">(' + dataOfYear.reduce(function (sum, /** @type {Data} */item) {
                return sum + item.count;
            }, 0) + ')</span>';

            result += '<ul class="' + className + '-month-list">';

            dataOfYear.forEach(function (dataOfMonth) {
                result += '<li class="' + className + '-month-list-item">';
                result += '<a class="' + className + '-month-list_link" href="' + self.url_for(archiveDir + '/' + dataOfMonth.year + '/' + dataOfMonth.month + '/') + '">';
                result += transform ? transform(dataOfMonth.monthName) : dataOfMonth.monthName;
                result += '</a>';
                result += '<span class="' + className + '-month-list-count">(' + dataOfMonth.count + ')</span>';
                result += '</li>';
            });

            result += '</ul></li>';
        });

        result += '</ul>';
    } else {
        var item, i, len;
        for (i = 0, len = data__.length; i < len; i++) {
            item = data__[i];

            if (i) result += separator;

            result += '<a class="' + className + '-link" href="' + link(item) + '">';
            result += transform ? transform(item.name) : item.name;

            if (showCount) {
                result += '<span class="' + className + '-count">' + item.count + '</span>';
            }

            result += '</a>';
        }
    }

    return result;
}

hexo.extend.helper.register('fold_list_archives', foldListArchivesHelper);