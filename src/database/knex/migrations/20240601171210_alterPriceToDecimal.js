exports.up = function (knex) {
  return knex.schema.alterTable("dishes", function (table) {
    table.decimal("price", 10, 2).alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("dishes", function (table) {
    table.text("price").alter();
  });
};