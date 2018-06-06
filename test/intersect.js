import test from 'ava';

import intersect from '../es/intersect.js';

test('null', t => {
  t.false(intersect(null, box(0,0,1,1)));
});

test('same', t => {
  t.true(intersect(box(0,0,1,1), box(0,0,1,1)));
});

test('far top', t => {
  t.false(intersect(box(0,0,1,1), box(0,5,1,1)));
});

test('far left', t => {
  t.false(intersect(box(0,0,1,1), box(5,0,1,1)));
});

test('far right', t => {
  t.false(intersect(box(5,0,1,1), box(0,0,1,1)));
});

test('far bottom', t => {
  t.false(intersect(box(0,5,1,1), box(0,0,1,1)));
});

test('just top', t => {
  t.false(intersect(box(0,0,1,1), box(0,1,1,1)));
});

test('just left', t => {
  t.false(intersect(box(0,0,1,1), box(1,0,1,1)));
});

test('just right', t => {
  t.false(intersect(box(1,0,1,1), box(0,0,1,1)));
});

test('just bottom', t => {
  t.false(intersect(box(0,1,1,1), box(0,0,1,1)));
});

test('top', t => {
  t.true(intersect(box(0,0,2,2), box(0,1,2,2)));
});

test('left', t => {
  t.true(intersect(box(0,0,2,2), box(1,0,2,2)));
});

test('right', t => {
  t.true(intersect(box(1,0,2,2), box(0,0,2,2)));
});

test('bottom', t => {
  t.true(intersect(box(0,1,2,2), box(0,0,2,2)));
});

test('top left', t => {
  t.true(intersect(box(0,0,2,2), box(1,1,2,2)));
});

test('top right', t => {
  t.true(intersect(box(2,0,2,2), box(1,1,2,2)));
});

test('bottom left', t => {
  t.true(intersect(box(0,2,2,2), box(1,1,2,2)));
});

test('bottom right', t => {
  t.true(intersect(box(2,2,2,2), box(1,1,2,2)));
});

function box(left, top, width, height){
  return {left, top, right:left+width, bottom:top+height};
}