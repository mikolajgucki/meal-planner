const assert = require('chai').assert;
const expect = require('chai').expect;
const MealCalculator = require('../src/app/meal/MealCalculator');

/*
const products = [
    {
        "name": {
            "en": "Apple"
        },
        "unit": "g",
        "energyPer100": 52
    },
    {
        "name": {
            "en": "Oat flakes"
        },
        "unit": "g",
        "energyPer100": 366
    }
];

describe('Calculate meal',() => {
    it('Should calculate meal with single ingredient',(done) => {
        const result = MealCalculator.calc(products,[
            { "name": "Apple", "amount": 150 }
        ],100);
        expect(result).to.eql({
            energy: 78,
            ingredients: [
                {
                    name: 'Apple',
                    amount: 150,
                    calc: {
                        amount: 150,
                        energy: 78,
                        unit: 'g'
                    }
                }
            ]
        });
        done();
    });

    it('Should calculate meal with single ratio',(done) => {
        const result = MealCalculator.calc(products,[
            { "name": "Apple", "amount": 100 },
            { "name": "Oat flakes", "ratio": 1 }
        ],250);
        expect(result).to.eql({
            energy: 250,
            ingredients: [
                {
                    name: 'Apple',
                    amount: 100,
                    calc: {
                        energy: 52,
                        amount: 100,
                        unit: 'g'
                    }
                },
                {
                    name: 'Oat flakes',
                    ratio: 1,
                    calc: {
                        amount: 54,
                        energy: 198,
                        unit: 'g'
                    }
                }
            ]
        });
        done();
    });

    it('Should calculate meal with single ratio and energy',(done) => {
        const result = MealCalculator.calc(products,[
            { "name": "Apple", "amount": 150 },
            { "name": "Millet flakes", "ratio": 1, "energyPer100": 352 }
        ],250);
        expect(result).to.eql({
            energy: 250,
            ingredients: [
                {
                    name: 'Apple',
                    amount: 150,
                    calc: {
                        energy: 78,
                        amount: 150,
                        unit: 'g'
                    }
                },
                {
                    name: 'Millet flakes',
                    ratio: 1,
                    energyPer100: 352,
                    calc: {
                        amount: 49,
                        energy: 172
                    }
                }
            ]
        });
        done();
    });
});
*/