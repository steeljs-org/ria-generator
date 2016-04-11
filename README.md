#Ria-generator


```javascript
var rg = require('ria-generator');

rg.getJSON('steel');
rg.getTaskfilePath('steel');
rg.template('steel', CWD, false);
rg.templateMatch('steel', CWD, glob)
rg.getType();
```

##rg.getJSON(type);
* `type` `{String}` Pattern to be matched
return the package.json file of a template

##rg.getTaskfilePath(type);
* `type` `{String}` Pattern to be matched
return a path of the gulpfile

##rg.template(type, path, isForced);
* `type` `{String}` template type to be matched
* `path` `{String}` destination folder path
* `isForced` `{bool}` if the file will be overwritten
output a template

##rg.templateMatch(type, path, pattern)
* `type` `{String}` template type to be matched
* `path` `{String}` destination folder path
* `pattern` `{String}` file name to be matched(Glob pattern)
output pattern matched File of a template

##rg.getType();
return all Template Type as an Array