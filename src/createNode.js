export default function createNode(size=1){
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