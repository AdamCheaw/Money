const sanitizeHtml = require('sanitize-html');

function FilterXSS(input) {
    return sanitizeHtml(input);
}

function CheckRegex(input, pattern) {
    return pattern.test(input);
}

module.exports = {
    FilterXSS, CheckRegex
}

