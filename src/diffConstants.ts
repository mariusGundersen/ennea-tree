import { Area } from './types';

export const SET : 'set' = 'set';
export const UPDATE : 'update' = 'update';
export const CLEAR : 'clear' = 'clear';

export interface ChangeSet<T> extends Area {
  readonly type : 'set',
  readonly after : T
}

export interface ChangeUpdate<T> extends Area {
  readonly type : 'update',
  readonly before : T,
  readonly after : T
}

export interface ChangeClear<T> extends Area {
  readonly type : 'clear',
  readonly before : T
}

export type Change<T> = ChangeSet<T> | ChangeUpdate<T> | ChangeClear<T>;