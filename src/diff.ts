import {
  SET,
  UPDATE,
  CLEAR,
  ChangeType
} from './diffConstants';
import intersect from './intersect';
import createNode from './createNode';

import { Node, Box, Area, BoxArea, BoxedData } from './types';

export interface Change<T> extends Area {
  readonly type: ChangeType,
  readonly before? : T,
  readonly after? : T
}

const nullBox = {top:0, left:0};

export default function *diff<T>(
  treeBeforeUnsafe : (Node<T> | null) = null,
  treeAfterUnsafe : (Node<T> | null) = null,
  top=0,
  left=0)
  : IterableIterator<Change<T>>{

  if(treeBeforeUnsafe === treeAfterUnsafe){
    return;
  }

  const treeBefore = treeBeforeUnsafe == null
  ? createNode<T>((treeAfterUnsafe as Node<T>).size)
  : treeBeforeUnsafe;

  const treeAfter = treeAfterUnsafe == null
  ? createNode<T>((treeBeforeUnsafe as Node<T>).size)
  : treeAfterUnsafe;

  if(treeBefore.data != null && treeAfter.data == null){
    yield clear(treeBefore.data, nullBox, top, left);
  }

  if(treeBefore.center != null
  && (treeAfter.center == null
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

  if(treeAfter.center != null){
    if(treeBefore.center == null || !sameBox(treeBefore.center, treeAfter.center)){
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

  if(treeAfter.data != null){
    if(treeBefore.data == null){
      yield set(treeAfter.data, nullBox, top, left);
    }else if(treeBefore.data !== treeAfter.data){
      yield update(treeBefore.data, treeAfter.data, nullBox, top, left);
    }
  }
}

function clear<T>(
  before : T,
  {top, left, right=left+1, bottom=top+1, width=right-left, height=bottom-top} : BoxArea,
  treeTop : number,
  treeLeft : number)
  : Change<T> {
  return {
    type: CLEAR as ChangeType,
    top: treeTop + top,
    left: treeLeft + left,
    width,
    height,
    before
  };
}

function set<T>(
  after : T,
  {top, left, right=left+1, bottom=top+1, width=right-left, height=bottom-top} : BoxArea,
  treeTop : number,
  treeLeft : number)
  : Change<T>{
  return {
    type: SET as ChangeType,
    top: treeTop + top,
    left: treeLeft + left,
    width,
    height,
    after
  };
}

function update<T>(
  before : T,
  after : T,
  {top, left, right=left+1, bottom=top+1, width=right-left, height=bottom-top} : BoxArea,
  treeTop : number,
  treeLeft : number)
  : Change<T>{
  return {
    type: UPDATE as ChangeType,
    top: treeTop + top,
    left: treeLeft + left,
    width,
    height,
    before,
    after
  };
}

function getSet<T>(
  befores : BoxedData<T>[],
  afters : BoxedData<T>[],
  top : number,
  left : number)
  : Change<T>[]{
  return afters
    .filter(after => befores.indexOf(after) < 0)
    .filter(after => !befores.some(before => sameBox(before, after)))
    .map(t => set(t.data, t, top, left));
}

function getUpdate<T>(
  befores : BoxedData<T>[],
  afters : BoxedData<T>[],
  top : number,
  left : number)
  : Change<T>[]{
  return afters
    .filter(after => befores.indexOf(after) < 0)
    .map(after => ({
      before: befores.filter(before => sameBox(before, after))[0],
      after
    }))
    .filter(t => t.before)
    .map(t => update(t.before.data, t.after.data, t.after, top, left))
}

function sameBox(a : Box, b : Box) : boolean {
  if(a.top !== b.top) return false;
  if(a.left !== b.left) return false;
  if(a.right !== b.right) return false;
  if(a.bottom !== b.bottom) return false;
  return true;
}