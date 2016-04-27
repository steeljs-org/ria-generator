
/**
 * control
 */
// var setTitle = require('util/setTitle');
module.exports = function(control) {
    // control.on('enter', function(transferData) {
    //     setTitle('微博橱窗');
    // });
	control.set({
		data: null,
		tpl: 'components/h5/m01/tpl',
		logic: 'components/h5/m01/logic',
		css: 'components/h5/m01/css'
	});
};