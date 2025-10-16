exports.up = function(knex) {
  return knex.schema
    .createTable('invoices', (table) => {
      table.increments('id').primary();
      table.string('invoice_number', 100).notNullable().unique();
      table.string('bank_name', 255).notNullable();
      table.string('bank_account_number', 100).notNullable();
      table.string('beneficiary_name', 255);
      table.timestamps(true, true);
      
      // Add index on invoice_number for faster lookups
      table.index('invoice_number');
    })
    .createTable('verification_logs', (table) => {
      table.increments('id').primary();
      table.string('invoice_number', 100).notNullable();
      table.string('ip_address', 45).notNullable();
      table.timestamp('verified_at').defaultTo(knex.fn.now());
      
      // Add foreign key reference to invoices table
      table.foreign('invoice_number')
           .references('invoice_number')
           .inTable('invoices')
           .onDelete('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('verification_logs')
    .dropTableIfExists('invoices');
};
