const axios = require('axios');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const config = require('./config.js');
const normalize = require('./normalize.js');

function requestData() {
  const mock = require('./mock.json');
  return Promise.resolve(mock);
  return axios.get(config.URL)
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    throw error;
  });
}

function getRestaurantObject(data) {
  return data;
  const $ = cheerio.load(data);
  const objectContent = $('script[data-component-name="MenuIndexApp"]').html();
  const object = JSON.parse(objectContent);
}

function main() {
  requestData()
    .then(data => {
      const restaurant = getRestaurantObject(data);
      const {entities, result: menu} = normalize(restaurant.menu);

      for(const item_id of menu.items) {
        const category_id = entities.items[item_id].category_id;
        if (!entities.categories[category_id].items) {
          entities.categories[category_id].items = [];
        }
        entities.categories[category_id].items.push(item_id);
      }

      for(const category_id of menu.categories) {
        const category = entities.categories[category_id];
        if (!category) continue;
        console.log(category.name)
        console.log(category.description);
        for(const item_id of category.items) {
          const item = entities.items[item_id];
          console.log(`  - ${item.name} : ${item.price}`);
        }
      }
    })
}

main();
