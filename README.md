#Ria-Generator
##Add Your Project Scaffold
1. You can add your project in the `template` folder.
2. **[Important]**Add `ria-type` field in your `package.json` . The field is recognized as your **project type**, which can be use with `steel-cli` (steel init -t [type])
3. If needed, you can rename your `taskfile.js` to `_task-steel.js`, which `steel-cli` can load. At the same time,create `stellfile.js` and move the variables in your `taskfile.js` to `steelfile.js`.