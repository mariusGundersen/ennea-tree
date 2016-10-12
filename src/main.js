export function set(tree, data, {top, left, width=1, height=1, right=left+width, bottom=top+height}){
  if(tree == null){
    return null;
  }

  if(tree.size === 1){
    return {
      ...tree,
      data
    };
  }

  const halfSize = tree.size/2;
  if(right < halfSize && bottom < halfSize){
    return {
      ...tree,
      topLeft: set(tree.topLeft || createNode(halfSize), data, {
        top,
        left,
        right,
        bottom
      })
    };
  }

  if(left >= halfSize && bottom < halfSize){
    return {
      ...tree,
      topRight: set(tree.topRight || createNode(halfSize), data, {
        top,
        left: left - halfSize,
        right: right - halfSize,
        bottom
      })
    };
  }

  if(right < halfSize && top >= halfSize){
    return {
      ...tree,
      bottomLeft: set(tree.bottomLeft || createNode(halfSize), data, {
        top: top - halfSize,
        left,
        right,
        bottom: bottom - halfSize
      })
    };
  }

  if(left >= halfSize && top >= halfSize){
    return {
      ...tree,
      bottomRight: set(tree.bottomRight || createNode(halfSize), data, {
        top: top - halfSize,
        left: left - halfSize,
        right: right - halfSize,
        bottom: bottom - halfSize
      })
    };
  }

  if(bottom < halfSize){
    return {
      ...tree,
      top: [...tree.top, {top, left, right, bottom, data}]
    }
  }

  if(right < halfSize){
    return {
      ...tree,
      left: [...tree.left, {top, left, right, bottom, data}]
    }
  }

  if(left >= halfSize){
    return {
      ...tree,
      right: [...tree.right, {top, left, right, bottom, data}]
    }
  }

  if(top >= halfSize){
    return {
      ...tree,
      bottom: [...tree.bottom, {top, left, right, bottom, data}]
    }
  }

  return {
    ...tree,
    center: {top, left, right, bottom, data}
  };
}

export function isEmpty(tree, area){
  return getAll(tree, area).length === 0;
}

export function getAll(tree, area){
  return [...getIterator(tree, area)];
}

export function get(tree, top, left){
  return [...getIterator(tree, {top, left})];
}

export function *getIterator(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height}){
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

  if(top < halfSize && right >= halfSize){
    yield* getIterator(tree.topRight, {
      top,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: min(bottom)
    });
  }

  if(bottom >= halfSize && left < halfSize){
    yield* getIterator(tree.bottomLeft, {
      top: max(top) - halfSize,
      left,
      right: min(right),
      bottom: bottom - halfSize
    });
  }

  if(bottom >= halfSize && right >= halfSize){
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

export function clear(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height}){
  if(tree == null){
    return null;
  }

  if(tree.data !== null){
    return {
      ...tree,
      data: null
    };
  }

  const halfSize = tree.size/2;
  const min = x => Math.min(x, halfSize);
  const max = x => Math.max(x, halfSize);
  const topLeft = top < halfSize && left < halfSize
    ? clear(tree.topLeft, {
      top,
      left,
      right: min(right),
      bottom: min(bottom)
    }) : tree.topLeft;
  const topRight = top < halfSize && right >= halfSize
    ? clear(tree.topRight, {
      top,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: min(bottom)
    }) : tree.topRight;
  const bottomLeft = bottom >= halfSize && left < halfSize
    ? clear(tree.bottomLeft, {
      top: max(top) - halfSize,
      left,
      right: min(right),
      bottom: bottom - halfSize
    }) : tree.bottomLeft;
  const bottomRight = bottom >= halfSize && right >= halfSize
    ? clear(tree.bottomRight, {
      top: max(top) - halfSize,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: bottom - halfSize
    }) : tree.bottomRight;
  const center = intersect(tree.center, {top, left, right, bottom})
    ? null
    : tree.center;
  const tops = top < halfSize
    ? tree.top.filter(box => !intersect(box, {top, left, right, bottom}))
    : tree.top;
  const lefts = left < halfSize
    ? tree.left.filter(box => !intersect(box, {top, left, right, bottom}))
    : tree.left;
  const rights = right >= halfSize
    ? tree.right.filter(box => !intersect(box, {top, left, right, bottom}))
    : tree.right;
  const bottoms = bottom >= halfSize
    ? tree.bottom.filter(box => !intersect(box, {top, left, right, bottom}))
    : tree.bottom;

  if(tops.length === tree.top.length
  && lefts.length === tree.left.length
  && rights.length === tree.right.length
  && bottoms.length === tree.bottom.length
  && center === tree.center
  && topLeft === tree.topLeft
  && topRight === tree.topRight
  && bottomLeft === tree.bottomLeft
  && bottomRight === tree.bottomRight){
    return tree;
  }

  if((tops.length
  || lefts.length
  || rights.length
  || bottom.lengths
  || center
  || topLeft
  || topRight
  || bottomLeft
  || bottomRight) === null){
    return null;
  }

  return {
    size: tree.size,
    top: tops,
    left: lefts,
    right: rights,
    bottom: bottoms,
    center,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  };
}

export function intersect(a, b){
  return !(a === null
        || b.left > a.right
        || b.right < a.left
        || b.top > a.bottom
        || b.bottom < a.top);
}

export function createNode(size){
  return {
    size,
    data: null,
    top: [],
    left: [],
    right: [],
    bottom: [],
    center: null,
    topLeft: null,
    topRight: null,
    bottomLeft: null,
    bottomRight: null,
  }
}