# LevelEditor
Old Repo was missing a .gitignore file that makes Unity and GitHub's married life bearable

level-editor-tests
==================

Experiments with in-browser level editors

==================

Sample 3D editor [taken from here](https://github.com/mrzapp/opened), all in js :(

First test:
https://rawgit.com/ARoomTooFar/level-editor-tests/master/Executables/web1.0/web1.0.html

Commented out these lines that cause build errors. :
```js 
return info.GetFiles ();
```
* Assets/Plugins/OpenEd/Scripts/OEFilesystem.js(74,29): BCE0019: 'GetFiles' is not a member of 'System.IO.DirectoryInfo'. 

```js 
return info.GetDirectories ();
```
* Assets/Plugins/OpenEd/Scripts/OEFilesystem.js(79,29): BCE0019: 'GetDirectories' is not a member of 'System.IO.DirectoryInfo'.  

```js 
sw = File.CreateText ( path );
```
* Assets/Plugins/OpenFile/OFWriter.js(13,43): BCE0019: 'CreateText' is not a member of 'System.IO.File'. 

