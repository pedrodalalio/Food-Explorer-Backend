exports.up = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.text('avatar').alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.string('avatar').alter();
  });
};