/**
 * steel gulpfile
 * author: @Finrila finrila@gmail.com
 */

var path = require('path');
var gulp = require('gulp');
var del = require('del');
var merge2 = require('merge2');
var $ = require('gulp-load-plugins')();

// var port = 80;
// var cssPostfix_filter = ["pages/*.*"];
// var pathnamePrefix = '/t6/apps/weibo_sell/';
// var front_base = 'server_front';
// var front_hostname = 'js.t.sinajs.cn img.t.sinajs.cn';
// var back_base = 'server_back'; //模拟后端的文件放置目录
// var back_hostname = 'shop.sc.weibo.com shop1.sc.weibo.com'; //后端的HOST，目的是真实模拟后端的页面路由请求，提供出前端可仿真的功能，比如 /index 对应 /html/index.html

gulp.task('default', function() {
    console.log('支持命令列表:')
    console.log('	gulp debug');
    console.log('		调试处理：对src目录文件进行debug处理，生成调试代码，包括模板处理、脚本wrap和合并、静态文件copy等');
    console.log('	gulp dist');
    console.log('		仿真处理：对src目录文件进行dist处理，生成仿真代码，除做debug中的处理外，还有css压缩合并');
    console.log('	gulp build');
    console.log('		上线处理：生成上线文件,会把可上线的结果处理了build目录下');
    console.log('	gulp server');
    console.log('		启动调试服务器命令 --dist 为仿真服务器 --pm2 为使服务后台运行(win下无效)');
    console.log('   gulp serverStop');
    console.log('       关闭服务器命令 当存在后台服务时有效');
});
//暴露命令相关=======================
gulp.task('debug', function() {
    del([front_base + '/*'], function() {
        gulp.start(['debug_html', 'debugCss', 'debugImg', 'debugJs']);
    });
});
gulp.task('dist', function() {
    del([front_base + '/*'], function() {
        gulp.start(['dist_html', 'distCss', 'distImg', 'distJs']);
    });
});
gulp.task('build', function() {
    del(['build/*'], function() {
        gulp.src(['src/css/**/*.*']).pipe($.steelCssFix(cssPostfix_option)).pipe($.minifyCss({
                compatibility: 'ie8'
            }))
            .pipe(gulp.dest('build/css/'));
        gulp.src(['src/img/**/*.*', '!**/*.psd', '!**/*.PSD', '!src/img/temp/**/*.*', '!src/img/_**/*.*']).pipe(gulp.dest('build/img/'));
        dealJs(false).pipe($.uglify())
            .pipe(gulp.dest('build/js/'));
    });
});

gulp.task('server', function() {
    var debug = !$.util.env.dist;
    steelServer({
        debug: debug,
        pm2: !!$.util.env.pm2,
        tasks: debug ? ['debug', 'watchDebug'] : ['dist', 'watchDist']
    });
});

gulp.task('serverStop', function() {
    $.steelServer.stop();
});

//=================================

//样式处理相关=======================
function deal_html() {
    gulp.src(['src/_html/**/*.*']).pipe(gulp.dest(front_base + '/_html/'));
}

function dealCss(isDebug) {
    if (isDebug) {
        gulp.src(['src/css/**/*.*']).pipe($.steelCssFix(cssPostfix_option)).pipe(gulp.dest(front_base + '/css/'));
    } else {
        gulp.src(['src/css/**/*.*'])
            .pipe($.steelCssFix(cssPostfix_option))
            .pipe($.minifyCss({
                compatibility: 'ie8'
            }))
            .pipe(gulp.dest(front_base + '/css/'));
    }
}

function dealImg() {
    gulp.src(['src/img/**/*.*', '!**/*.psd', '!**/*.PSD']).pipe(gulp.dest(front_base + '/img/'));
}

gulp.task('debug_html', function() {
    deal_html();
});
gulp.task('debugCss', function() {
    dealCss(true);
});
gulp.task('debugImg', function() {
    dealImg();
});
gulp.task('dist_html', function() {
    deal_html();
});
gulp.task('distCss', function() {
    dealCss(false);
});
gulp.task('distImg', function() {
    dealImg();
});
//=================================

//Jade JS处理相关=======================
function dealJs(isDebug) {
    var debugConfig = '!src/js/lib/debugConfig.js';
    if (isDebug) {
        debugConfig = '';
    }
    return merge2(
        gulp.src(['src/js/lib/steel.js', 'src/js/lib/zepto.js', 'src/js/lib/**/*.js', debugConfig], {
            base: 'src/js/'
        }).pipe($.concat('lib/lib.js')),

        merge2(
            gulp.src(['src/js/**/*.jade'])
            .pipe($.jade({
                client: true,
                compileDebug: isDebug
            }))
            .pipe($.steelJadefnWrapCommonjs()),

            gulp.src(['src/js/**/*.js'])
        ).pipe($.steelWrapAmd())
        .pipe($.steelAmdConcat())
    );
}

gulp.task('debugJs', function() {
    dealJs(true).pipe(gulp.dest(front_base + '/js/'));
});

gulp.task('distJs', function() {
    dealJs(false)
        .pipe($.uglify())
        .pipe(gulp.dest(front_base + '/js/'));
});
//=================================
//文件监听相关=======================
function getServer_frontPath(filepath) {
    return filepath.replace(process.cwd(), '').replace(/\\/g, '/').replace(/\/?src\/js\//, front_base + '/js/')
}

gulp.task('watchDebug', function() {
    gulp.watch('src/_html/**/*.*').on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('debug_html');
    });
    gulp.watch('src/css/**/*.*').on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('debugCss');
    });
    gulp.watch('src/img/**/*.*').on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('debugImg');
    });
    gulp.watch('src/js/**/*.*').on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        if (event.type === 'deleted') {
            gulp.src(getServer_frontPath(event.path)).pipe($.clean());
            gulp.start('debugJs');
        } else {
            gulp.start('debugJs');
        }
    });
});

gulp.task('watchDist', function() {
    gulp.watch('src/_html/**/*.*').on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('dist_html');
    });
    gulp.watch('src/css/**/*.*').on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('distCss');
    });
    gulp.watch('src/img/**/*.*').on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('distImg');
    });
    gulp.watch('src/js/**/*.*').on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        if (event.type === 'deleted') {
            gulp.src(getServer_frontPath(event.path)).pipe($.clean());
            gulp.start('distJs');
        } else {
            gulp.start('distJs');
        }
    });
});
//=================================

//服务器相关=======================
function steelServer(options) {
    $.steelServer({
        port: port,
        pathnamePrefix: pathnamePrefix,
        front_base: front_base,
        front_hostname: front_hostname, //前端的HOST
        back_base: back_base, //模拟后端的文件放置目录
        back_hostname: back_hostname, //后端的HOST，目的是真实模拟后端的页面路由请求，提供出前端可仿真的功能，比如 /index 对应 /html/index.html
        gzip: !options.debug,
        access_control_allow: true,
        staticProxy: {
            'js*.t.sinajs.cn/*': 'sinajs.xdwscache.glb0.lxdns.com',
            'img*.t.sinajs.cn/*': 'sinajs.xdwscache.glb0.lxdns.com',
            'tjs.sjs.sinajs.cn/*': 'sinajs.xdwscache.glb0.lxdns.com'
        },
        pm2: options.pm2,
        tasks: options.tasks
    });
}
//=================================