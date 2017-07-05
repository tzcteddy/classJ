import a from './A1';
let avg = ()=> {
    arguments.__proto__ = Array.prototype;
    arguments.sort(function (a, b) {
        return a - b;
    });
    arguments.shift();
    arguments.pop();

    return (a.sum(...arguments) / arguments.length).toFixed(2);
};
export {avg};