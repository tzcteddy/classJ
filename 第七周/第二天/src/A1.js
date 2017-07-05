let sum = ()=> {
    let total = null;
    arguments.__proto__ = Array.prototype;
    arguments.forEach(item=> {
        item = Number(item);
        !isNaN(item) ? total += item : null;
    });
    return total;
};
export {sum};