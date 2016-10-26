import intersect from './intersect.js';

export default function *getIterator(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height}){
  if(tree == null){
    return;
  }

  if(tree.data !== null){
    return yield {
      data: tree.data,
      top: 0,
      left: 0
    };
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

  const area = {top, left, right, bottom};
  if(tree.center !== null){
    yield* getIntersections([tree.center], area);
  }

  if(top < halfSize){
    yield* getIntersections(tree.top, area);
  }

  if(left < halfSize){
    yield* getIntersections(tree.left, area);
  }

  if(right >= halfSize){
    yield* getIntersections(tree.right, area);
  }

  if(bottom >= halfSize){
    yield* getIntersections(tree.bottom, area);
  }
}

function* getIntersections(boxes, area){
    for(const box of boxes){
      if(intersect(box, area)){
        yield {
          data: box.data,
          top: area.top - box.top,
          left: area.left - box.left
        };
      }
    }
}