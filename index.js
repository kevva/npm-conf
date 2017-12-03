'use strict';
const path = require('path');
const url = require('url');
const Conf = require('./lib/conf');
const defaults = require('./lib/defaults');

// https://github.com/npm/npm/blob/latest/lib/config/core.js#L101-L200
module.exports = opts => {
	const conf = new Conf(Object.assign({}, defaults.defaults));

	conf.add(Object.assign({}, opts), 'cli');
	conf.addEnv();
	conf.loadPrefix();

	const projectConf = path.resolve(conf.localPrefix, '.npmrc');
	const userConf = conf.get('userconfig');

	if (!conf.get('global') && projectConf !== userConf) {
		conf.addFile(projectConf, 'project');
	} else {
		conf.add({}, 'project');
	}

	conf.addFile(conf.get('userconfig'), 'user');

	if (conf.get('prefix')) {
		const etc = path.resolve(conf.get('prefix'), 'etc');
		conf.root.globalconfig = path.resolve(etc, 'npmrc');
		conf.root.globalignorefile = path.resolve(etc, 'npmignore');
	}

	conf.addFile(conf.get('globalconfig'), 'global');
	conf.loadUser();

	const caFile = conf.get('cafile');

	if (caFile) {
		conf.loadCAFile(caFile);
	}

	return conf;
};

module.exports.defaults = Object.assign({}, defaults.defaults);

// Copied from https://github.com/npm/npm/blob/0cc9d89ed2d46745f91d746fda9d205fd39d3daa/lib/config/nerf-dart.js
module.exports.toNerfDart = uri => {
	const parsed = url.parse(uri);
	delete parsed.protocol;
	delete parsed.auth;
	delete parsed.query;
	delete parsed.search;
	delete parsed.hash;

	return url.resolve(url.format(parsed), '.');
};
