/**
 * 模块逻辑
 */

var chartIndex = require('module/index');

module.exports = function(node, data, control) {

    var that = {};

    var steelRouter = steel.router.get();
    var daterange = steelRouter.query.daterange || 7;
    var charts = [
        'newFollower',
        'followersBreakdown',
        'lostFollower',
        'friendCount',
        'commonFollower',
        'pageVisit',
        'myPost',
        'repostComment',
        'impressions',
        'interaction'
    ]
    var chartLoader = null;
    
    $(node).on('touchend', '[date-range]', function(e) {
        var self = $(this),
            daterange = self.attr('date-range');
        // var query = $.extend(steelRouter.query, {
        //     daterange: self.attr('date-range')
        // })
        // var arr = [];
        // for (var key in query) {
        //     arr.push(key + '=' + query[key]);
        // }
        // var url = steelRouter.url.split('?');
        // url[1] = arr.join('&');
        // location.href = url.join('?');
        $('[date-range].on').removeClass('on');
        $(self).addClass('on');
        chartLoader.redraw({daterange: daterange});

        // var self = $(this);
        // steel.router.replace('&daterange=' + self.attr('date-range'));
    })


    var init = function() {
        
        chartLoader = initChartIndex()
    };

    init();

    that.destroy = function() {
        $(node).off();
        !!window.WeiboJSBridge && window.WeiboJSBridge.off();

        if (isWeiboWebView) {
            window.WeiboJSBridge.off("visibilityChange", WeiboJSBridge_visibilityChangeFn);
        }
    };


    return that;


    function initChartIndex() {
        var token = data.userInfo.oauth_token;

        return chartIndex({
            box: $('[node-type="card-box"]', node),
            charts: charts,
            commonParam: {
                ajData: {
                    oauth_token: token,
                    daterange: daterange
                },
                ispc: false
            }
        })
    }
};