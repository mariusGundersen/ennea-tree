import intersect from './intersect.js';

export default function update(tree, getData){
  const generator = updateGenerator(tree, getData);
  generator.next();
  return {
    update({top, left, right=left+1, bottom=top+1}, context={top, left}){
      generator.next({
        area: {
          top,
          left,
          right,
          bottom
        },
        context
      });
    },
    result(changes = []){
      for(const change of changes){
        this.update(change.area, change.context);
      }
      return generator.next().value;
    }
  }
}

export function* updateGenerator(tree, getData){
  if(tree === null){
    let change;
    while(change = yield);
    return null;
  }

  if(tree.data !== null){
    let data = tree.data;
    let change = null;
    while(change = yield){
      data = getData(data, change.context, {top: 0, left: 0});
    }

    if(change === null){
      return tree;
    }

    return {
      ...tree,
      data
    };
  }else{
    const halfSize = tree.size/2;
    let center = tree.center;
    let top = tree.top;
    let left = tree.left;
    let right = tree.right;
    let bottom = tree.bottom;
    let topLeft = null;
    let topRight = null;
    let bottomLeft = null;
    let bottomRight = null;
    let change = null;
    while(change = yield){
      if(center !== null && intersect(change.area, center)){
        center = {
          ...center,
          data: getData(center.data, change.context, {top: change.area.top - center.top, left: change.area.left - center.left})
        };
      }else if(change.area.top < halfSize && top.some(t => intersect(change.area, t))){
        top = top.map(t => intersect(change.area, t)
          ? {
            ...t,
            data: getData(t.data, change.context, {top: change.area.top - t.top, left: change.area.left - t.left})
          } : t);
      }else if(change.area.left < halfSize && left.some(t => intersect(change.area, t))){
        left = left.map(t => intersect(change.area, t)
          ? {
            ...t,
            data: getData(t.data, change.context, {top: change.area.top - t.top, left: change.area.left - t.left})
          } : t);
      }else if(change.area.left >= halfSize && right.some(t => intersect(change.area, t))){
        right = right.map(t => intersect(change.area, t)
          ? {
            ...t,
            data: getData(t.data, change.context, {top: change.area.top - t.top, left: change.area.left - t.left})
          } : t);
      }else if(change.area.top >= halfSize && bottom.some(t => intersect(change.area, t))){
        bottom = bottom.map(t => intersect(change.area, t)
          ? {
            ...t,
            data: getData(t.data, change.context, {top: change.area.top - t.top, left: change.area.left - t.left})
          } : t);
      }else if(change.area.top < halfSize && change.area.left < halfSize){
        topLeft = topLeft || update(tree.topLeft, getData);
        topLeft.update({top: change.area.top, left: change.area.left}, change.context);
      }else if(change.area.top < halfSize && change.area.left >= halfSize){
        topRight = topRight || update(tree.topRight, getData);
        topRight.update({top: change.area.top, left: change.area.left - halfSize}, change.context);
      }else if(change.area.top >= halfSize && change.area.left < halfSize){
        bottomLeft = bottomLeft || update(tree.bottomLeft, getData);
        bottomLeft.update({top: change.area.top - halfSize, left: change.area.left}, change.context);
      }else if(change.area.top >= halfSize && change.area.left >= halfSize){
        bottomRight = bottomRight || update(tree.bottomRight, getData);
        bottomRight.update({top: change.area.top - halfSize, left: change.area.left - halfSize}, change.context);
      }
    }

    if(change === null){
      return tree;
    }

    return {
      size: tree.size,
      data: null,
      center,
      top,
      left,
      right,
      bottom,
      topLeft: topLeft === null ? tree.topLeft : topLeft.result(),
      topRight: topRight === null ? tree.topRight : topRight.result(),
      bottomLeft: bottomLeft === null ? tree.bottomLeft : bottomLeft.result(),
      bottomRight: bottomRight === null ? tree.bottomRight : bottomRight.result()
    }
  }
}
