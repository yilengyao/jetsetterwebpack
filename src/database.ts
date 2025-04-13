import knex, { Knex } from 'knex';
import path from 'path';
import { App } from 'electron';

const database = (app: App): Knex => {
    let db = knex({
                client: 'sqlite3',
                connection: {
                filename: path.join(app.getPath('userData'), 'jetsetter-items.sqlite')
            },
           useNullAsDefault: true
        });

    db.schema.hasTable('items').then(exists => {
        if (!exists) {
            return db.schema.createTable('items', table => {
                table.increments('id').primary();
                table.string('value', 100);
                table.boolean('packed');
            });
        }
    });
    
    return db;
};

export default database;


