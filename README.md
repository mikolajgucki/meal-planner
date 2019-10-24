# Meal Planner

Meal Planner is a dead simple web aplication for planning meals.
It is intended to run on a local computer for personal use.

Meal Planner takes a list of ingredients of your meal and calculates amounts and
facts (calories, carbs, sugars, fat). There are two ways of passing amount of
an ingredient. The first one lets you enter the exact amount. The second one
lets you enter a ratio which is used to calculate the amount to reach given
number of calories of the meal.

The application is built from two elements:
- server which is built on top of Node.JS,
- frontend which is a React application.

## Building and running

First, install dependencies:
```bash
npm install
```

Then, build the frontend part:
```bash
npm run build
```

Last, run the server which provides API and serves the frontend files:
```bash
npm start
```

The server by default runs on port 8088 and is available under
`http://localhost:8080`. The port can be changed in the file `data/cfg.json`.

## Usage

The application takes number of planned calories for your meal and a list of ingredients. Enter the number of calories in the _Energy_ field.

Ingredients are entered in the _Ingredients_ area. Each line represents one ingredient which is entered as ingredient name followed by amount. You can enter exact amount. For example `Orange 100` means 100 grams of orange. On the other hand amount can be given as ratio. For example `Dried apricot 1x` means to calculate how many grams of dried apricot is necessary to reach the given number of calories. If you enter two ingredients with the same ratio, the necessary calories will be split equally among the ingredients.

If you have an ingredient not listed in the products, you can specify the energy of the product using the `*` sign. Typically you get the calories from the packaging. For example, `Canned bean 10*120` means 10 grams of canned beans which have 120 calories per 100 grams.

Amounts and facts about your meal are updated and displayed as you enter or change ingredients. If there is an error in ingredients, it is also instantly shown.

You can hit control + space for a list of products in a combo for easy pick.

## Modifying products

Products are kept in a file. The path to the file can be found in the configuration. By default it's `data/db/products.json`. The server watches the file and if it's modified, the server reads and processes it. You will be notified in the browser about any changes made to the products. You will get info when a product is added, removed, changed or the product file contains an error. In case of error, the products are not changed.