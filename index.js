var fs = require('fs');
var path = require('path');
var semver = require('semver');
var chalk = require('chalk');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var tpl = require('./template')();

var generator = module.exports

function findLastest(versions) {
    var t = '0.0.0';
    for (var v in versions) {
        if (semver.lt(t, v)) t = v;
    }
    return t;
}

generator.getTaskfilePath = function getTaskfilePath(type) {
    return tpl[type].getTaskfilePath();
}

generator.template = function template(type, destination, checkexist) {
    var t = tpl[type];
    var filepath = t.filePaths;
    var folderRoot = t.folderRoot;
    var cwd = process.cwd();
    
    for (var i = 0, l = filepath.length; i < l; i++) {
        var source = path.join(folderRoot, filepath[i]);
        var destination = path.join(cwd, filepath[i])
        output(source, destination, checkexist)
    }

}

function output(source, destination, checkexist) {
    var body = read(source);
    write(destination, body, checkexist);
}

function read(filepath, encoding) {
    var contents = fs.readFileSync(filepath);

    return contents.toString(encoding || 'utf8');
};

function write(filepath, content, checkexist) {

    mkdirp.sync(path.dirname(filepath));
    fs.stat(filepath, function(err, stat) {
        if(err == null) {
            checkexist && fs.writeFile(filepath, content, function(e) {
                !e && console.log('generate file: ' ,filepath)
            })
        } else if(err.code == 'ENOENT') {
            fs.writeFile(filepath, content, function(e) {
                !e && console.log('generate file: ' ,filepath)
            })
        } else {
            console.log('Some other error: ', err.code);
        }
    });
    
    return this;
};
