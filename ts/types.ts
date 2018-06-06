export interface Pos{
  readonly top : number,
  readonly left : number,
}

export interface Area{
  readonly top : number,
  readonly left : number,
  readonly width : number,
  readonly height : number,
}

export interface Box{
  readonly top : number,
  readonly left : number,
  readonly right : number,
  readonly bottom : number,
}

export interface Boxish{
  readonly top : number,
  readonly left : number,
  readonly right? : number,
  readonly bottom? : number,
}

export interface BoxArea{
  readonly top : number,
  readonly left : number,
  readonly right? : number,
  readonly bottom? : number,
  readonly width? : number,
  readonly height? : number,
}

export interface BoxedData<T> extends Box{
  readonly data : T
}

export interface AreaData<T> extends Area{
  readonly data : T
}

export interface Node<T>{
  readonly size : number,
  readonly data? : T,
  readonly top : BoxedData<T>[],
  readonly left : BoxedData<T>[],
  readonly right : BoxedData<T>[],
  readonly bottom : BoxedData<T>[],
  readonly center? : BoxedData<T>,
  readonly topLeft? : Node<T>,
  readonly topRight? : Node<T>,
  readonly bottomLeft? : Node<T>,
  readonly bottomRight? : Node<T>,
}