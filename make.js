'use strict';
const fs = require('fs');
const babylon = require('babylon');
const generate = require('babel-generator').default;
const traverse = require('babel-traverse').default;

const defaults = require.resolve('npm/lib/config/defaults');
const ast = babylon.parse(fs.readFileSync(defaults, 'utf8'));

const isExports = node =>
	node.type === 'CallExpression' &&
	node.callee.type === 'MemberExpression' &&
	node.callee.object.name === 'Object' &&
	node.callee.property.name === 'defineProperty' &&
	node.arguments.some(x => x.name === 'exports');

const p = {};

traverse(ast, {
	enter(path) {
		if (isExports(path.node)) {
			Object.assign(p, path.node);
		}
	}
});

console.log(generate(p, {}, ast));
