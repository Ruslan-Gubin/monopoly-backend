export const getUnicNumber = (id) => {
    return +id.split('').filter(item => Number.isFinite(Number(item))).join('');
};
