/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/plantr', {
  logging: false,
  operatorsAliases: false,
});
const moment = require('moment');

const getRandomDate = () => {
  const daysAgo = Math.floor(Math.random() * 366);
  return moment()
    .subtract(daysAgo, 'days')
    .toDate();
};

const Vegetable = db.define(
  'vegetable',
  {
    name: { type: Sequelize.STRING, allowNull: false },
    color: Sequelize.STRING,
    planted_on: Sequelize.DATE,
  },
  {
    hooks: {
      beforeCreate: (veggie, options) => {
        if (!veggie.planted_on) {
          veggie.planted_on = getRandomDate();
        }
      },
      //   beforeBulkCreate: (veggies, options) => {
      //     //   veggies.forEach(veg => {
      //     //     if (!veg.planted_on) {
      //     //       veg.planted_on = getRandomDate();
      //     //     }
      //     //   });
      //     options.indivdualHooks = true;
      //   },
    },
  }
);

const Gardener = db.define('gardener', {
  name: { type: Sequelize.STRING, allowNull: false },
  age: Sequelize.INTEGER,
});

const Plot = db.define('plot', {
  size: { type: Sequelize.INTEGER, allowNull: false },
  shaded: Sequelize.BOOLEAN,
});
Plot.belongsTo(Gardener);
Gardener.hasOne(Plot);

Vegetable.belongsToMany(Plot, { through: 'vegetable_plot' });
Plot.belongsToMany(Vegetable, { through: 'vegetable_plot' });

Gardener.belongsTo(Vegetable, { as: 'favoriteVegetable' });

module.exports = { db, Vegetable, Gardener, Plot };
