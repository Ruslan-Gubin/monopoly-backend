export const checkCellType = (type) => {
    const map = {
        property: 'property',
        port: 'property',
        'utilities-water': 'property',
        'utilities-energy': 'property',
        'action-chance': 'action',
        'action-lottery': 'action',
        customs: 'corner',
        'visit theater': 'corner',
        start: 'corner',
        theater: 'corner',
        'action-tax': 'tax',
    };
    return map[type];
};
