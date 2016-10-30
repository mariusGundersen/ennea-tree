import intersect from './intersect.js';

export default function update(branch, getData){
  const generator = updateGenerator(branch, getData);
  generator.next();
  return {
    update(top, left, pos={top, left}){
      generator.next({
        top,
        left,
        right: left+1,
        bottom: top+1,
        pos
      });
    },
    result(positions = []){
      for(const pos of positions){
        this.update(pos.top, pos.left);
      }
      return generator.next().value;
    }
  }
}

export function* updateGenerator(tree, getData){
  if(tree === null){
    let area;
    while(area = yield);
    return null;
  }

  if(tree.data !== null){
    let data = tree.data;
    let area = null;
    while(area = yield){
      data = getData(data, area.pos, {top: 0, left: 0});
    }

    if(area === null){
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
    let area = null;
    while(area = yield){
      if(tree.center !== null && intersect(area, tree.center)){
        center = {
          ...center,
          data: getData(center.data, area, {top: area.top - tree.center.top, left: area.left - tree.center.left})
        };
      }else if(area.top < halfSize && tree.top.some(t => intersect(area, t))){
        top = tree.top.map(t => intersect(area, t)
          ? {
            ...t,
            data: getData(t.data, area, {top: area.top - t.top, left: area.left - t.left})
          } : t);
      }else if(area.left < halfSize && tree.left.some(t => intersect(area, t))){
        left = tree.left.map(t => intersect(area, t)
          ? {
            ...t,
            data: getData(t.data, area, {top: area.top - t.top, left: area.left - t.left})
          } : t);
      }else if(area.left >= halfSize && tree.right.some(t => intersect(area, t))){
        right = tree.right.map(t => intersect(area, t)
          ? {
            ...t,
            data: getData(t.data, area, {top: area.top - t.top, left: area.left - t.left})
          } : t);
      }else if(area.right >= halfSize && tree.bottom.some(t => intersect(area, t))){
        bottom = tree.bottom.map(t => intersect(area, t)
          ? {
            ...t,
            data: getData(t.data, area, {top: area.top - t.top, left: area.left - t.left})
          } : t);
      }else if(area.top < halfSize && area.left < halfSize){
        topLeft = topLeft || update(tree.topLeft, getData);
        topLeft.update(area.top, area.left, area.pos);
      }else if(area.top < halfSize && area.left >= halfSize){
        topRight = topRight || update(tree.topRight, getData);
        topRight.update(area.top, area.left - halfSize, area.pos);
      }else if(area.top >= halfSize && area.left < halfSize){
        bottomLeft = bottomLeft || update(tree.bottomLeft, getData);
        bottomLeft.update(area.top - halfSize, area.left, area.pos);
      }else if(area.top >= halfSize && area.left >= halfSize){
        bottomRight = bottomRight || update(tree.bottomRight, getData);
        bottomRight.update(area.top - halfSize, area.left - halfSize, area.pos);
      }
    }

    if(area === null){
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
