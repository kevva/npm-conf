'use strict';
const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const generate = require('babel-generator').default;
const traverse = require('babel-traverse').default;

const defaultsTemplate = body => `
	'use strict';
	const path = require('path');
	const osenv = require('osenv');
	const umask = require('umask');
	const hasUnicode = require('has-unicode');

	const temp = osenv.tmpdir();
	const uidOrPid = process.getuid ? process.getuid() : process.pid;

	let home = osenv.home();

	if (home) {
		process.env.HOME = home;
	} else {
		home = path.resolve(temp, 'npm-' + uidOrPid);
	}

	const cacheExtra = process.platform === 'win32' ? 'npm-cache' : '.npm';
	const cacheRoot = process.platform === 'win32' && process.env.APPDATA || home;
	const cache = path.resolve(cacheRoot, cacheExtra);

	let defaults;
	let globalPrefix;

	${body}
`;

const typesTemplate = body => `
	'use strict';
	const os = require('os');
	const path = require('path');
	const Stream = require('stream').Stream;
	const url = require('url');
	const semver = require('semver');

	const Umask = () => {};
	const getLocalAddresses = () => {
		let interfaces;

		try {
			interfaces = os.networkInterfaces();
		} catch (err) {
			interfaces = {};
		}

		return Object.keys(interfaces)
			.map(x => interfaces[x]
				.filter(y => y.family === 'IPv4')
				.map(y => y.address))
			.reduce((arr, x) => arr.concat(x), [])
			.concat(undefined);
	};

	${body}
`;

const defaults = require.resolve('npm/lib/config/defaults');
const ast = babylon.parse(fs.readFileSync(defaults, 'utf8'));

const isDefaults = node =>
	node.callee.type === 'MemberExpression' &&
	node.callee.object.name === 'Object' &&
	node.callee.property.name === 'defineProperty' &&
	node.arguments.some(x => x.name === 'exports');

const isTypes = node =>
	node.type === 'MemberExpression' &&
	node.object.name === 'exports' &&
	node.property.name === 'types';

let defs;
let types;

traverse(ast, {
	CallExpression(path) {
		if (isDefaults(path.node)) {
			defs = path.node;
		}
	},

	AssignmentExpression(path) {
		if (path.node.left && isTypes(path.node.left)) {
			types = path.node;
		}
	}
});

fs.writeFileSync(path.join(__dirname, 'defaults.js'), defaultsTemplate(generate(defs, {}, ast).code));
fs.writeFileSync(path.join(__dirname, 'types.js'), typesTemplate(generate(types, {}, ast).code));
