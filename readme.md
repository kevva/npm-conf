# npm-conf [![Build Status](https://travis-ci.org/kevva/npm-conf.svg?branch=master)](https://travis-ci.org/kevva/npm-conf)

> Get the npm config


## Install

```
$ npm install npm-conf
```


## Usage

```js
const npmConf = require('npm-conf');

const conf = npmConf();

conf.get('prefix')
//=> /Users/unicorn/.npm-packages

conf.get('registry')
//=> https://registry.npmjs.org/

conf.get(npmConf.toNerfDart(conf.get('registry')) + ':always-auth')
//=> true
```

To get a list of all available `npm` config options:

```bash
$ npm config list --long
```


## API

### npmConf()

Returns the `npm` config.

### npmConf.defaults

Returns the default `npm` config.

### npmConf.toNerfDart

Util function which takes an url and "nerfs" it. This allows you to fetch
config by scope. See usage in npm:
https://github.com/npm/npm/blob/0cc9d89ed2d46745f91d746fda9d205fd39d3daa/lib/config/get-credentials-by-uri.js


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
