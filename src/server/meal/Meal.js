/** */
class Meal {
    /** */
    static getNames(meal) {
        const names = [];
        for (const lang in meal.name) {
            let name = meal.name[lang];
            names.push(name);
        }
        return names;
    }
}

module.exports = Meal;