
/**
 * control
 */
// var setTitle = require('util/setTitle');
module.exports = function(control) {
    // control.on('enter', function(transferData) {
    //     setTitle('微博橱窗');
    // });
	control.set({
		data: '/aj/h5/index?{oauth_token}{daterange}',//h5/index?oauth_token=2.00FxKOzBsZ4hiC40b43bd93b3fJuBE
		tpl: 'components/h5/index/tpl',
		logic: 'components/h5/index/logic',
		css: 'components/h5/index/css'
	});
};