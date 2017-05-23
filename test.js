import test from 'ava';
import m from '.';

test(async t => {
	const conf = await m();
	t.truthy(conf.get('prefix'));
});
