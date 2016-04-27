/**
 * 模块逻辑
 */

// var uiTip = require('ui/tip');


module.exports = function(node, data, control) {

    var that = {};

    alertMsg()
    
    that.destroy = function() {
        $(node).off();
        !!window.WeiboJSBridge && window.WeiboJSBridge.off();
       
        if (isWeiboWebView) {
            window.WeiboJSBridge.off("visibilityChange", WeiboJSBridge_visibilityChangeFn);
        }
    };
    
    
    return that;

    function alertMsg(){
        // alert(data.ajMsg);
    }
};