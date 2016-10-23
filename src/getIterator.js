import intersect from './intersect.js';

export default function *getIterator(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height}){
  if(tree == null){
    return;
  }

  if(tree.data !== null){
    return yield tree.data;
  }

  const halfSize = tree.size/2;
  const min = x => Math.min(x, halfSize);
  const max = x => Math.max(x, halfSize);
  if(top < halfSize && left < halfSize){
    yield* getIterator(tree.topLeft, {
      top,
      left,
      right: min(right),
      bottom: min(bottom)
    });
  }

  if(top < halfSize && right > halfSize){
    yield* getIterator(tree.topRight, {
      top,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: min(bottom)
    });
  }

  if(bottom > halfSize && left < halfSize){
    yield* getIterator(tree.bottomLeft, {
      top: max(top) - halfSize,
      left,
      right: min(right),
      bottom: bottom - halfSize
    });
  }

  if(bottom > halfSize && right > halfSize){
    yield* getIterator(tree.bottomRight, {
      top: max(top) - halfSize,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: bottom - halfSize
    });
  }

  if(tree.center !== null){
    if(intersect(tree.center, {top, left, right, bottom})){
      yield tree.center.data;
    }
  }

  if(top < halfSize){
    for(const box of tree.top){
      if(intersect(box, {top, left, right, bottom})){
        yield box.data;
      }
    }
  }

  if(left < halfSize){
    for(const box of tree.left){
      if(intersect(box, {top, left, right, bottom})){
        yield box.data;
      }
    }
  }

  if(right >= halfSize){
    for(const box of tree.right){
      if(intersect(box, {top, left, right, bottom})){
        yield box.data;
      }
    }
  }

  if(bottom >= halfSize){
    for(const box of tree.bottom){
      if(intersect(box, {top, left, right, bottom})){
        yield box.data;
      }
    }
  }
}