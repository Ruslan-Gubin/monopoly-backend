
export const getUnicNumber = (id: string): number => {
  return +id.split('').filter(item => Number.isFinite(Number(item))).join('')
}