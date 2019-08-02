import { Box } from './types';

export default function intersect(a: Box | undefined, b: Box): boolean {
  if (a == undefined) return false;
  if (b.left >= a.right) return false;
  if (b.right <= a.left) return false;
  if (b.top >= a.bottom) return false;
  if (b.bottom <= a.top) return false;
  return true;
}
