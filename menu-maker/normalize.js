const { normalize, schema } = require('normalizr');
const crypto = require('crypto');

const category = new schema.Entity('categories');

const modifier_group = new schema.Entity('modifier_groups');

const item = new schema.Entity('items', {
  'category_id': category,
  'modifier_groups': [ modifier_group ]
});

const menu = new schema.Object({
  'categories': [ category ],
  'items': [ item ]
});

module.exports = function(originalData) {
  return normalize(originalData, menu);
}
