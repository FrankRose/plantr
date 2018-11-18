/* eslint-disable camelcase */
const { db, Vegetable, Plot, Gardener } = require('./models');
const chalk = require('chalk');

(async () => {
  try {
    await db.sync({ force: true });
    const bulkCreateOptions = { returning: true, individualHooks: true };
    const [veggies, plots, gardeners] = await Promise.all([
      Vegetable.bulkCreate(
        [
          { name: 'Broccoli', color: 'green' },
          { name: 'Squash', color: 'yellow' },
          { name: 'Pepper', color: 'red' },
          { name: 'Pumpkin', color: 'orange' },
          { name: 'Tomato', color: 'red' },
          { name: 'Beet', color: 'purple' },
          { name: 'Carrot', color: 'orange' },
          { name: 'Cauliflower', color: 'white' },
          { name: 'Potato', color: 'brown' },
          {
            name: 'Spinach',
            color: 'Green',
            planted_on: new Date(Date.now()),
          },
          { name: 'Corn', color: 'yellow' },
          { name: 'Onion', color: 'white' },
          { name: 'Pepper', color: 'black' },
        ],
        bulkCreateOptions
      ),
      Plot.bulkCreate(
        [
          { size: 33, shaded: true },
          { size: 55, shaded: true },
          { size: 78, shaded: false },
          { size: 89, shaded: false },
          { size: 101, shaded: true },
          { size: 212, shaded: false },
        ],
        bulkCreateOptions
      ),
      Gardener.bulkCreate(
        [
          { name: 'Bugs Bunny', age: 11 },
          { name: 'Daffy Duck', age: 13 },
          { name: 'Porky Pig', age: 19 },
        ],
        bulkCreateOptions
      ),
    ]);

    const [north, south, east, west, midwest, northeast] = plots;
    const [bugs, daffy, porky] = gardeners;

    await Promise.all([
      north.setGardener(bugs),
      north.setVegetables(veggies.slice(2, 5)),
      south.setGardener(porky),
      south.setVegetables(veggies.slice(4, 10)),
      east.setGardener(porky),
      east.setVegetables(veggies.slice(7)),
      west.setGardener(bugs),
      west.setVegetables(veggies.slice(2, 8)),
      midwest.setGardener(daffy),
      midwest.setVegetables(veggies.slice(3)),
      northeast.setGardener(porky),
      northeast.setVegetables(veggies.slice(-10)),
      bugs.setFavoriteVegetable(veggies[3]),
      daffy.setFavoriteVegetable(veggies[8]),
      porky.setFavoriteVegetable(veggies[1]),
    ]);

    console.log(
      chalk`{cyan db}{white.bold .}{yellow sync}{yellowBright ()}{greenBright.bold  Executed SUCCESSFULLY!!}`
    );
  } catch (error) {
    console.error(chalk`{redBright.bold ${error.message}}`);
    console.error(chalk`{red ${error.stack}}`);
  } finally {
    db.close();
    console.log(
      chalk`{cyan db}{white.bold .}{yellow close}{yellowBright ()}{greenBright.bold  Executed SUCCESSFULLY!!}`
    );
  }
})();
