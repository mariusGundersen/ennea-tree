import intersect from './intersect.js';
import createNode from './createNode.js';

export default function *diff(treeBefore=null, treeAfter=null, top=0, left=0){
  if(treeBefore === treeAfter){
    return;
  }

  if(treeBefore === null){
    treeBefore = createNode(treeAfter.size);
  }

  if(treeAfter === null){
    treeAfter = createNode(treeBefore.size);
  }

  if(treeBefore.data !== null && treeAfter.data === null){
    yield clear(treeBefore.data, {}, top, left);
  }

  if(treeBefore.center !== null
  && (treeAfter.center === null
  || !sameBox(treeBefore.center, treeAfter.center))){
    yield clear(treeBefore.center.data, treeBefore.center, top, left);
  }

  if(treeBefore.top !== treeAfter.top){
    yield* treeBefore.top
      .filter(b => treeAfter.top.indexOf(b) < 0)
      .filter(b => !treeAfter.top.some(a => sameBox(a, b)))
      .map(t => clear(t.data, t, top, left));
  }

  if(treeBefore.left !== treeAfter.left){
    yield* treeBefore.left
      .filter(b => treeAfter.left.indexOf(b) < 0)
      .filter(b => !treeAfter.left.some(a => sameBox(a, b)))
      .map(t => clear(t.data, t, top, left));
  }

  if(treeBefore.right !== treeAfter.right){
    yield* treeBefore.right
      .filter(b => treeAfter.right.indexOf(b) < 0)
      .filter(b => !treeAfter.right.some(a => sameBox(a, b)))
      .map(t => clear(t.data, t, top, left));
  }

  if(treeBefore.bottom !== treeAfter.bottom){
    yield* treeBefore.bottom
      .filter(b => treeAfter.bottom.indexOf(b) < 0)
      .filter(b => !treeAfter.bottom.some(a => sameBox(a, b)))
      .map(t => clear(t.data, t, top, left));
  }

  const halfSize = treeBefore.size/2;
  yield* diff(treeBefore.topLeft, treeAfter.topLeft, top, left);
  yield* diff(treeBefore.topRight, treeAfter.topRight, top, left+halfSize);
  yield* diff(treeBefore.bottomLeft, treeAfter.bottomLeft, top+halfSize, left);
  yield* diff(treeBefore.bottomRight, treeAfter.bottomRight, top+halfSize, left+halfSize);

  if(treeAfter.center !== null){
    if(treeBefore.center === null || !sameBox(treeBefore.center, treeAfter.center)){
      yield set(treeAfter.center.data, treeAfter.center, top, left);
    }else if(treeBefore.center !== treeAfter.center && sameBox(treeBefore.center, treeAfter.center)){
      yield update(treeBefore.center.data, treeAfter.center.data, treeAfter.center, top, left);
    }
  }

  if(treeBefore.top !== treeAfter.top){
    yield* getSet(treeBefore.top, treeAfter.top, top, left);
    yield* getUpdate(treeBefore.top, treeAfter.top, top, left);
  }

  if(treeBefore.left !== treeAfter.left){
    yield* getSet(treeBefore.left, treeAfter.left, top, left);
    yield* getUpdate(treeBefore.left, treeAfter.left, top, left);
  }

  if(treeBefore.right !== treeAfter.right){
    yield* getSet(treeBefore.right, treeAfter.right, top, left);
    yield* getUpdate(treeBefore.right, treeAfter.right, top, left);
  }

  if(treeBefore.bottom !== treeAfter.bottom){
    yield* getSet(treeBefore.bottom, treeAfter.bottom, top, left);
    yield* getUpdate(treeBefore.bottom, treeAfter.bottom, top, left);
  }

  if(treeAfter.data !== null){
    if(treeBefore.data === null){
      yield set(treeAfter.data, {}, top, left);
    }else if(treeBefore.data !== treeAfter.data){
      yield update(treeBefore.data, treeAfter.data, {}, top, left);
    }
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

function update(before, after, {top=0, left=0, right=left+1, bottom=top+1, width=right-left, height=bottom-top}, treeTop, treeLeft){
  return {
    type: 'update',
    top: treeTop + top,
    left: treeLeft + left,
    width,
    height,
    before,
    after
  };
}

function getSet(befores, afters, top, left){
  return afters
    .filter(after => befores.indexOf(after) < 0)
    .filter(after => !befores.some(before => sameBox(before, after)))
    .map(t => set(t.data, t, top, left));
}

function getUpdate(befores, afters, top, left){
  return afters
    .filter(after => befores.indexOf(after) < 0)
    .map(after => ({
      before: befores.filter(before => sameBox(before, after))[0],
      after
    }))
    .filter(t => t.before)
    .map(t => update(t.before.data, t.after.data, t.after, top, left))
}

function sameBox(a, b){
  if(a.top !== b.top) return false;
  if(a.left !== b.left) return false;
  if(a.right !== b.right) return false;
  if(a.bottom !== b.bottom) return false;
  return true;
}