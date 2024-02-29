
module.exports = {
    ifeq: function (a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    DisplayNumber: function (splitBy, num) {
        if (splitBy == 0) {
            return `<div>$${num}</div>`;
        }
        else {
            return `<div>$${(Number(num) / Number(splitBy)).toFixed(2)}</div><div class="small-txt">$${num}/${splitBy}</div>`;
        }
    }
}