const { isDigit } = require('../util/util');

/** */
function parseAmountValue(value) {
    for (let index = 0; index < value.length; index++) {
        const ch = value.charAt(index);
        if (!(isDigit(ch) || ch == '.')) {
            return null;
        }
    }

    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}

/** */
function throwError(msg,lineNo) {
    throw { msg, lineNo };
}

/** */
class IngredientsParser {
    /** */
    static isAmountExpression(str) {
        if (!str) {
            return false;
        }
        for (let index = 0; index < str.length; index++) {
            const ch = str.charAt(index);
            if (!(isDigit(ch) || ch == 'x' || ch == '*' || ch == '.')) {
                return false;
            }
        }
        return true;
    }

    /** */
    static parseAmountExpression(str,lineNo) {
        const expression = {};
        const asteriskIndex = str.indexOf('*');
        const hasEnergy = asteriskIndex >= 0;

    // amount string
        const amountStr = hasEnergy ? str.substring(0,asteriskIndex) : str;
        if (amountStr.length > 0) {
        // ratio
            if (amountStr.charAt(amountStr.length - 1) == 'x') {
                const ratioStr = amountStr.substring(0,amountStr.length - 1);
                expression.ratio = parseAmountValue(ratioStr);
                if (!expression.ratio) {
                    throwError(`Invalid ratio ${amountStr}`,lineNo);
                }
            }
        // amount
            else {
                expression.amount = parseAmountValue(amountStr);
                if (!expression.amount) {
                    throwError(`Invalid amount ${amountStr}`,lineNo);
                }
            }
        }

    // energy
        if (hasEnergy) {
            const energyStr = str.substring(asteriskIndex + 1,str.length);
            expression.energyPer100 = parseAmountValue(energyStr);
            if (!expression.energyPer100) {
                throwError(`Invalid energy ${energyStr}`,lineNo);
            }
        }

        return expression;
    }

    /** */
    static getIngredientName(tokens,hasAmount) {
        if (hasAmount) {
            return tokens.slice(0,tokens.length - 1).join(' ');
        }
        else {
            return tokens.join(' ');
        }
    }

    /** */
    static parseLine(line) {
        const tokens = line.split(' ').filter(token => token.length > 0);
        const lastToken = tokens.length > 1 ? tokens[tokens.length - 1] : null;
        const hasAmount = IngredientsParser.isAmountExpression(lastToken);
        const amountStr = hasAmount ? lastToken : null;
        const name = IngredientsParser.getIngredientName(tokens,hasAmount);
        return {
            tokens, lastToken, hasAmount, name, amountStr
        }
    }

    /** */
    static parse(text) {
        const lines = text.split(/[\r\n]+/g).filter(
            line => line.trim().length > 0);
        const ingredients = [];

        let lineNo = 1;
    // for each line
        for (const line of lines) {
            const { tokens, lastToken, hasAmount, name } =
                IngredientsParser.parseLine(line);
            if (!lastToken) {
                throwError('No amount',lineNo);
            }

        // amount
            let amount = IngredientsParser.parseAmountExpression(
                lastToken,lineNo);

        // name + amount
            const ingredient = { name, ...amount };
            ingredients.push(ingredient);
            lineNo++;
        }

        return ingredients;
    }
}

module.exports = IngredientsParser;