/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('panic', {
        id: { type: 'text', primaryKey: true },
        timestamp: { type: 'bigint', notNull: true },
        status: { type: 'text', notNull: true },           // processing | active | resolved
        location_lat: { type: 'double precision', notNull: true },
        location_lng: { type: 'double precision', notNull: true },
        metadata: { type: 'jsonb' }
    });

    pgm.createIndex('panic', ['status']);
    pgm.createIndex('panic', ['timestamp']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('panic');
};
