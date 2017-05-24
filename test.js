import npmCore from 'npm/lib/config/core';
import npmDefaults from 'npm/lib/config/defaults';
import pify from 'pify';
import test from 'ava';
import m from '.';

test('mirror npm config', async t => {
	const conf = m();
	const npmconf = await pify(npmCore.load)();

	t.is(conf.get('globalPrefix'), npmconf.get('globalPrefix'));
	t.is(conf.get('localPrefix'), npmconf.get('localPrefix'));
	t.is(conf.get('prefix'), npmconf.get('prefix'));
	t.is(conf.get('proxy'), npmconf.get('proxy'));
	t.is(conf.get('registry'), npmconf.get('registry'));
	t.is(conf.get('tmp'), npmconf.get('tmp'));
});

test('mirror npm defaults', t => {
	t.deepEqual(m.defaults, npmDefaults.defaults);
});
