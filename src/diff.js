import intersect from './intersect.js';
import createNode from './createNode.js';

export default function *diff(treeBefore, treeAfter, top=0, left=0){
  if(treeBefore === treeAfter){
    return;
  }

  if(treeBefore === null){
    treeBefore = createNode(treeAfter.size);
  }

  if(treeAfter === null){
    treeAfter = createNode(treeBefore.size);
  }

  if(treeBefore.data !== null && treeBefore.data !== treeAfter.data){
    yield clear(treeBefore.data, {}, top, left);
  }

  if(treeBefore.center !== null && treeBefore.center !== treeAfter.center){
    yield clear(treeBefore.center.data, treeBefore.center, top, left);
  }

  if(treeBefore.top !== treeAfter.top){
    yield* treeBefore.top.filter(t => treeAfter.top.indexOf(t) < 0).map(t => clear(t.data, t, top, left));
  }

  if(treeBefore.left !== treeAfter.left){
    yield* treeBefore.left.filter(t => treeAfter.left.indexOf(t) < 0).map(t => clear(t.data, t, top, left));
  }

  if(treeBefore.right !== treeAfter.right){
    yield* treeBefore.right.filter(t => treeAfter.right.indexOf(t) < 0).map(t => clear(t.data, t, top, left));
  }

  if(treeBefore.bottom !== treeAfter.bottom){
    yield* treeBefore.bottom.filter(t => treeAfter.bottom.indexOf(t) < 0).map(t => clear(t.data, t, top, left));
  }

  const halfSize = treeBefore.size/2;
  yield* diff(treeBefore.topLeft, treeAfter.topLeft, top, left);
  yield* diff(treeBefore.topRight, treeAfter.topRight, top, left+halfSize);
  yield* diff(treeBefore.bottomLeft, treeAfter.bottomLeft, top+halfSize, left);
  yield* diff(treeBefore.bottomRight, treeAfter.bottomRight, top+halfSize, left+halfSize);

  if(treeBefore.center !== treeAfter.center && treeAfter.center !== null){
    yield set(treeBefore.center.data, treeBefore.center, top, left);
  }

  if(treeBefore.top !== treeAfter.top){
    yield* treeAfter.top.filter(t => treeBefore.top.indexOf(t) < 0).map(t => set(t.data, t, top, left));
  }

  if(treeBefore.left !== treeAfter.left){
    yield* treeAfter.left.filter(t => treeBefore.left.indexOf(t) < 0).map(t => set(t.data, t, top, left));
  }

  if(treeBefore.right !== treeAfter.right){
    yield* treeAfter.right.filter(t => treeBefore.right.indexOf(t) < 0).map(t => set(t.data, t, top, left));
  }

  if(treeBefore.bottom !== treeAfter.bottom){
    yield* treeAfter.bottom.filter(t => treeBefore.bottom.indexOf(t) < 0).map(t => set(t.data, t, top, left));
  }

  if(treeBefore.data !== treeAfter.data && treeAfter.data !== null){
    yield set(treeAfter.data, {}, top, left);
  }
}

function clear(before, {top=0, left=0, right=left+1, bottom=top+1, width=right-left, height=bottom-top}, treeTop, treeLeft){
  return {
    type: 'clear',
    top: treeTop + top,
    left: treeLeft + left,
    width,
    height,
    before
  };
}

function set(after, {top=0, left=0, right=left+1, bottom=top+1, width=right-left, height=bottom-top}, treeTop, treeLeft){
  return {
    type: 'set',
    top: treeTop + top,
    left: treeLeft + left,
    width,
    height,
    after
  };
}