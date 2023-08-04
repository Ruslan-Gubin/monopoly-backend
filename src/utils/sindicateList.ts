
const sindicateList = [
  [2, 4],
  [6, 7, 9],
  [11, 12, 14],
  [16, 17, 19],
  [21, 22, 24],
  [26, 27, 29],
  [31, 32, 34],
  [37, 39],
]

export const checkSindicate = (value: number): number[] | null => {
  return sindicateList.reduce((acc, elem) => {
    if (elem.includes(value)) {
      acc = elem
    }
    return acc
  }, []).filter(item => item !== value)
}