const assert = require('chai').assert;
const expect = require('chai').expect;
const IngredientsParser = require('../src/app/meal/IngredientsParser');

/** */
function expectToThrowIngredientsError(expr,msg,lineNo) {
    try {
        expr();
    } catch (err) {
        if (err.msg != msg || err.lineNo != lineNo) {
            throw new Error(`Expected '${msg}' in line ${lineNo} to be thrown` +
                ` but '${err.msg}' in line ${err.lineNo} was thrown`);
        }
    }
}

/** */
describe('Check amount expression',() => {
    it('Should amount be an amount expression',(done) => {
        assert.isOk(IngredientsParser.isAmountExpression('45'));
        assert.isOk(IngredientsParser.isAmountExpression('45.100'));
        done();
    });

    it('Should amount*energy be an amount expression',(done) => {
        assert.isOk(IngredientsParser.isAmountExpression('45*99'));
        assert.isOk(IngredientsParser.isAmountExpression('45.5*99'));
        assert.isOk(IngredientsParser.isAmountExpression('45*99.66'));
        assert.isOk(IngredientsParser.isAmountExpression('45.07*99.008'));
        done();
    });

    it('Should ratio be an amount expression',(done) => {
        assert.isOk(IngredientsParser.isAmountExpression('45x'));
        assert.isOk(IngredientsParser.isAmountExpression('120.05x'));
        done();
    });

    it('Should ratio*energy be an amount expression',(done) => {
        assert.isOk(IngredientsParser.isAmountExpression('45x*340'));
        assert.isOk(IngredientsParser.isAmountExpression('45.1x*340'));
        assert.isOk(IngredientsParser.isAmountExpression('45x*340.2'));
        assert.isOk(IngredientsParser.isAmountExpression('45.33x*340.44'));
        done();
    });

    it('Should energy be an amount expression',(done) => {
        assert.isOk(IngredientsParser.isAmountExpression('*280'));
        assert.isOk(IngredientsParser.isAmountExpression('*280.25'));
        done();
    });
});

/** */
describe('Parse amount expression',() => {
    it('Should parse amount',(done) => {
        const expr = IngredientsParser.parseAmountExpression('45');
        expect(expr).to.eql({ amount: 45 });
        done();
    });

    it('Should not parse invalid amount',(done) => {
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'apple45',1),'Invalid amount apple45',1);
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'66pear',7),'Invalid amount 66pear',7);
        done();
    });
    it('Should parse amount*energy',(done) => {
        const expr = IngredientsParser.parseAmountExpression('45*99');
        expect(expr).to.eql({ amount: 45, energyPer100: 99 });
        done();
    });

    it('Should not parse invalid amount*energy',(done) => {
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'apple45*99',2),'Invalid amount apple45',2);
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'45apple*99',3),'Invalid amount 45apple',3);
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'66*az100',4),'Invalid energy az100',4);
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'66*100az',5),'Invalid energy 100az',5);
        done();
    });

    it('Should parse ratio',(done) => {
        const expr = IngredientsParser.parseAmountExpression('3x');
        expect(expr).to.eql({ ratio: 3 });
        done();
    });

    it('Should not parse invalid ratio',(done) => {
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'apple45x',1),'Invalid ratio apple45x',1);
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'45plumx',1),'Invalid ratio 45plumx',1);
        done();
    });

    it('Should parse ratio*energy',(done) => {
        const expr = IngredientsParser.parseAmountExpression('2x*340');
        expect(expr).to.eql({ ratio: 2, energyPer100: 340 });
        done();
    });

    it('Should not parse invalid ratio*energy',(done) => {
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'az66x*10',1),'Invalid ratio az66x',1);
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'66azx*10',1),'Invalid ratio 66azx',1);
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'66x*abc10',1),'Invalid energy abc10',1);
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'66*10abc',1),'Invalid energy 10abc',1);
        done();
    });

    it('Should parse energy',(done) => {
        const expr = IngredientsParser.parseAmountExpression('*278');
        expect(expr).to.eql({ energyPer100: 278 });
        done();
    });

    it('Should not parse invalid energy',(done) => {
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'*10abc',1),'Invalid energy 10abc',1);
        expectToThrowIngredientsError(
            IngredientsParser.parseAmountExpression.bind(
            IngredientsParser,'*abc10',1),'Invalid energy abc10',1);
        done();
    });
});

describe('Parse one ingredient',() => {
    it('Should parse one ingredient with amount',(done) => {
        const ingredients = IngredientsParser.parse('Baked apple 10');
        expect(ingredients).to.eql([{
            name: 'Baked apple',
            amount: 10 
        }]);
        done();
    });

    it('Should parse one ingredient with amount*energy',(done) => {
        const ingredients = IngredientsParser.parse('Rolled oats 56*340');
        expect(ingredients).to.eql([{
            name: 'Rolled oats',
            amount: 56,
            energyPer100: 340
        }]);
        done();
    });

    it('Should parse one ingredient with ratio*energy',(done) => {
        const ingredients = IngredientsParser.parse('Rolled oats 2x*340');
        expect(ingredients).to.eql([{
            name: 'Rolled oats',
            ratio: 2,
            energyPer100: 340
        }]);
        done();
    });

    it('Should parse one ingredient with energy',(done) => {
        const ingredients = IngredientsParser.parse('Rolled oats *340');
        expect(ingredients).to.eql([{
            name: 'Rolled oats',
            energyPer100: 340
        }]);
        done();
    });
});

describe('Parse two ingredients',() => {
    it('Should parse two ingredients with amount',(done) => {
        const ingredients = IngredientsParser.parse(
            'Baked apple 10\nPear 40');
        expect(ingredients).to.eql([
            {
                name: 'Baked apple',
                amount: 10 
            },
            {
                name: 'Pear',
                amount: 40 
            }
        ]);
        done();
    });
});

describe('Parse ingredients with empty lines',() => {
    it('Should parse ingredients with leading empty line',(done) => {
        const ingredients = IngredientsParser.parse(
            '   \nBaked apple 10\nPear 40');
        expect(ingredients).to.eql([
            {
                name: 'Baked apple',
                amount: 10 
            },
            {
                name: 'Pear',
                amount: 40 
            }
        ]);
        done();
    });
    it('Should parse ingredients with trailing empty line',(done) => {
        const ingredients = IngredientsParser.parse(
            'Baked apple 10\nPear 40\n   ');
        expect(ingredients).to.eql([
            {
                name: 'Baked apple',
                amount: 10 
            },
            {
                name: 'Pear',
                amount: 40 
            }
        ]);
        done();
    });
    it('Should parse ingredients with empty lines',(done) => {
        const ingredients = IngredientsParser.parse(
            '    \nBaked apple 10\n    \nPear 40\n   ');
        expect(ingredients).to.eql([
            {
                name: 'Baked apple',
                amount: 10 
            },
            {
                name: 'Pear',
                amount: 40 
            }
        ]);
        done();
    });
});