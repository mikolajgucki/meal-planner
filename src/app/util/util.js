/** */
const diacriticsToLatinTable = {
    'ą':'a',
    'ć':'c',
    'ę':'e',
    'ł':'l',
    'ń':'n',
    'ó':'o',
    'ś':'s',
    'ż':'z',
    'ź':'z',

    'Ą':'A',
    'Ć':'C',
    'Ę':'E',
    'Ł':'L',
    'Ń':'N',
    'Ó':'O',
    'Ś':'S',
    'Ż':'Z',
    'Ź':'Z'
};

/** */
function isDigit(ch) {
    return '0123456789'.includes(ch);
}

/** */
function parseInteger(str) {
    for (let index = 0; index < str.length; index++) {
        if (!isDigit(str.charAt(index))) {
            return NaN;
        }
    }
    return parseInt(str);
}

/** */
function compareIgnoreCase(a,b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b,undefined,{ sensitivity: 'accent' }) === 0
        : a === b;
}

/** */
function containsIgnoreCase(a,b){
    return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
}

/** */
function diacriticsToLatin(str) {
    let newStr = '';
    for (let index = 0; index < str.length; index++) {
        const ch = str.charAt(index);
        if (diacriticsToLatinTable[ch]) {
            newStr += diacriticsToLatinTable[ch];
        }
        else {
            newStr += ch;
        }
    }
    return newStr;
}

/** */
function indexesOfIgnoreCase(str,searchValue) {
// to lower case to that it ignores case
    str = str.toLocaleLowerCase();
    searchValue = searchValue.toLocaleLowerCase();

    const indexes = [];
    let lastIndex = 0;
    while (true) {
        const index = str.indexOf(searchValue,lastIndex);
        if (index == -1) {
            break;
        }
        indexes.push(index);
        lastIndex = index + searchValue.length;
    }
    if (indexes.length === 0) {
        return null;
    }
    return indexes;
}

module.exports = { isDigit, parseInteger, compareIgnoreCase,
    containsIgnoreCase, diacriticsToLatin, indexesOfIgnoreCase };