# Робота півфіналу UaWebChallengeVI - ARCHIVED

###### Технології: HTML5, CSS3, JS, jQuery, Pug, SCSS, microformats.
###### Сумісність: IE8+, Firefox29.0+, Chrome34.0+, Opera21.0+, Safari5.1+, Yandex.browser14.2+
UPD: Робота не в оригінальному вигляді, так як в деяких місцях рефакторив код, пробуючи нові штуки

## Демо
[http://orlovmax.github.io/uawebchallengeVI_2](http://orlovmax.github.io/uawebchallengeVI_2 "Глянути результат півфіналу UaWebChallenge")


## Тестові скріншоти
- Результат [test_screenshots](https://github.com/orlovmax/uawebchallengeVI_2/tree/master/test_screenshots/)
- Тест сумісності браузерів, окрім експлореру [browser_compat](https://github.com/orlovmax/uawebchallengeVI_2/tree/master/test_screenshots/browser_compat/)
- Тест адаптивності [responsive](https://github.com/orlovmax/uawebchallengeVI_2/tree/master/test_screenshots/responsive/)

---

![uaweb-semifinal template](test_screenshots/responsive/uaweb-semi_firefox-30.0_gt1400px.jpg)

## Contents
* [Folder structure](#folder-and-file-structure)
* [Requirements](#requirements)
	- [Editorconfig](#editorconfig)
* [How to start](#how-to-start)
* [Tasks](#tasks)
	- [Start](#start)
	- [Dev](#dev)
	- [Build](#build)
	- [Rebuild](#rebuild)
	- [Server](#server)
* [Live reload](#live-reload)

## Warning! Some technologies used in this project may be out of date.

## Folder and file structure
```
./
├── .editorconfig
├── README.md
|
├── _grunt/                                    * grunt build system
|	├── grunt_tasks/                           * grunt tasks
|	|   ├── config/                            * grunt tasks config
|	│   |	├── paths.js
|	│   |	├── settings.js
|	│   |	└── aliases.js
|	│   |
|	|   └── task.js
|	│
|	├── Gruntfile.js
|	└── package.json
|
├── screenshots/                               * responsive test screenshots
|
├── dev/                                       * site source
│   ├── images/                                * image sources
|	│
│   ├── pug/                                   * templates
|	│
│   ├── js/                                    * source js
|	│
|	├── sass/                                  * sass preprocessor styles
|	│
│   ├── helpers/                               * helper files
|	│
│   └── fonts/                                 * font sources
│
└── build/                                     * built source
	├── index.html
	|
	└── static/                                * static assets
		├── css/                               * minified styles
		|
		├── images/                            * minified images
		│
		├── js/                                * minified assembled js
		|
		└── fonts/                             * @font-face-ready webfonts

```

## Requirements:
- [Node.js](http://nodejs.org/)
- Build sytem: [Grunt](http://gruntjs.com/)
- Optionally: [Editorconfig](http://editorconfig.org/)

#### Editorconfig
This project have .editorconfig file at the root that used by your code editor with editorconfig plugin. It describes codestyle like indent style, trailing whitespaces etc. See more details [here](http://editorconfig.org/)

## How to start
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to use [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

Before start you need to have installed _npm_ , as well as _grunt_ globally.

## Tasks
Here comes groups of grunt tasks with some explanations

#### Start 
Remove placeholders from work directories.
Grunt: `grunt start`

* Remove gitkeep files

#### Dev
Dev task with static server.
Grunt: `grunt dev`

* Combine javascripts
* Compile Sass stylesheets
* Add vendor prefixes in css
* Combine media queries in css files
* Compile Pug templates
* Sync helpers and other assets
* Sync fonts
* Sync images
* Run BrowserSync static server with live reload using 
* Watch for changes and run dev task


#### Build 
Build task.
Grunt: `grunt build`

* Minify images
* Minify javascript files
* Minify stylesheets
* Minify html
* Run BrowserSync static server 


#### Rebuild 
Regenerate and build project by running all tasks.
Grunt: `grunt rebuild`

* Combine javascripts
* Compile Sass stylesheets
* Add vendor prefixes in css
* Combine media queries in css files
* Compile Pug templates
* Sync helpers and other assets
* Sync fonts
* Sync images
* Minify images
* Minify javascript files
* Minify stylesheets
* Minify html


#### Server 
Run server without watching for changes.
Grunt: `grunt server`

* Run BrowserSync static server


## Live reload 
This project uses BrowserSync as static server with enabled and configured live reload option.
