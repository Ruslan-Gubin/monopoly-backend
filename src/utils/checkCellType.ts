
export const checkCellType = (type: string): string => {
  const map: {[key: string]: string} = {
    property: 'property',
    port: 'property',
   'utilities-water': 'property',
   'utilities-energy': 'property',
    'action-chance': 'action',
    'action-lottery': 'action',
    customs: 'corner',
    'visit theater': 'corner',
    start: 'corner',
    theatre: 'corner',
    'action-tax': 'tax',
  }
  return map[type]
}