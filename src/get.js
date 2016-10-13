import intersect from './intersect.js';

export default function get(tree, top, left){
  if(tree == null){
    return null;
  }

  if(tree.data !== null){
    return tree.data;
  }

  const halfSize = tree.size/2;
  const right = left+1;
  const bottom = top+1;
  const min = x => Math.min(x, halfSize);
  const max = x => Math.max(x, halfSize);
  if(bottom < halfSize && right < halfSize){
    return get(tree.topLeft,
      top,
      left);
  }

  if(bottom < halfSize && left >= halfSize){
    return get(tree.topRight,
      top,
      max(left) - halfSize);
  }

  if(top >= halfSize && right < halfSize){
    return get(tree.bottomLeft,
      max(top) - halfSize,
      left);
  }

  if(top >= halfSize && left >= halfSize){
    return get(tree.bottomRight,
      max(top) - halfSize,
      max(left) - halfSize);
  }

  if(tree.center !== null){
    if(intersect(tree.center, {top, left, right, bottom})){
      return tree.center.data;
    }
  }

  if(top < halfSize){
    for(const box of tree.top){
      if(intersect(box, {top, left, right, bottom})){
        return box.data;
      }
    }
  }

  if(left < halfSize){
    for(const box of tree.left){
      if(intersect(box, {top, left, right, bottom})){
        return box.data;
      }
    }
  }

  if(right >= halfSize){
    for(const box of tree.right){
      if(intersect(box, {top, left, right, bottom})){
        return box.data;
      }
    }
  }

  if(bottom >= halfSize){
    for(const box of tree.bottom){
      if(intersect(box, {top, left, right, bottom})){
        return box.data;
      }
    }
  }
}