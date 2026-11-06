import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('parses directive sources', () => {
  assert.deepEqual(api.parsePolicy("default-src 'self' https:; img-src data:"), {
    'default-src': ["'self'", 'https:'],
    'img-src': ['data:'],
  });
});
test('ignores repeated semicolon separators', () => {
  assert.deepEqual(api.parsePolicy(';;;'), {});
});
test('formats in deterministic key order', () => {
  assert.equal(
    api.formatPolicy({ 'img-src': ['data:'], 'default-src': ["'self'"] }),
    "default-src 'self'; img-src data:",
  );
});
test('looks up directives case insensitively', () => {
  assert.deepEqual(api.directive(api.parsePolicy('img-src data:'), 'IMG-SRC'), ['data:']);
});
test('rejects duplicate directives', () => {
  assert.throws(() => api.parsePolicy('default-src self; default-src none'), TypeError);
});
test('rejects line injection during formatting', () => {
  assert.throws(() => api.formatPolicy({ 'img-src': ['x\ny'] }), TypeError);
});
