'use strict';
const path = require('path');
const makeDir = require('make-dir');
const Conf = require('./lib/conf');
const defaults = require('./lib/defaults');
const types = require('./lib/types');

module.exports = opts => {
	opts = Object.assign({}, opts);

	const conf = new Conf(Object.assign({}, defaults.defaults));

	conf.add(opts, 'cli');
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
		makeDir.sync(etc);
		conf.root.globalconfig = path.resolve(etc, 'npmrc');
		conf.root.globalignorefile = path.resolve(etc, 'npmignore');
	}

	conf.addFile(conf.get('globalconfig'), 'global');
	conf.loadExtras();

	const caFile = conf.get('cafile');

	if (caFile) {
		conf.loadCAFile(caFile);
	}

	return conf;
};

module.exports.Conf = Conf;
module.exports.defaults = Object.assign({}, defaults.defaults);
module.exports.types = Object.assign({}, types.types);
