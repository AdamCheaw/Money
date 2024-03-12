const logger = require("firebase-functions/logger");

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
    },
    StringifyJSON: function (obj) {
        if (obj === null || obj === undefined || typeof obj !== 'object' || Object.keys(obj).length === 0) {
            return "{}";
        }

        try {
            return JSON.stringify(obj);
        }
        catch (error) {
            logger.error(error);
            return "{}";
        }
    }
}