'use strict';
const npmconf = require('npm/lib/config/core');
const pify = require('pify');

module.exports = () => pify(npmconf.load)();
