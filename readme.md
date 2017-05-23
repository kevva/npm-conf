# npm-conf [![Build Status](https://travis-ci.org/kevva/npm-conf.svg?branch=master)](https://travis-ci.org/kevva/npm-conf)

> Get the npm config


## Install

```
$ npm install --save npm-conf
```


## Usage

```js
const npmConf = require('npm-conf');

npmConf().then(conf => {
	console.log(conf.get('prefix'));
	//=> /Users/unicorn/.npm-packages
});
```


## API

### npmConf()

Returns a Promise with the `npm` config.


## License

MIT © [Kevin Martensson](http://github.com/kevva)
