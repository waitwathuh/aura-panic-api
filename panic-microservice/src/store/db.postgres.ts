import { Pool } from 'pg';
import { Panic } from '../models/panic';
import { config } from '../config';

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  ssl: config.db.ssl ? { rejectUnauthorized: false } : undefined,
  max: 5 // RDS Proxy recommended in AWS for pooling
});

export const panicDb = {
  async insert(panic: Panic): Promise<void> {
    await pool.query(
      `INSERT INTO panic (id, timestamp, status, location_lat, location_lng, metadata)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO NOTHING`,
      [panic.id, panic.timestamp, panic.status, panic.location.lat, panic.location.lng, JSON.stringify(panic.metadata || {})]
    );
  },

  async update(panic: Panic): Promise<void> {
    await pool.query(
      `UPDATE panic SET timestamp=$2, status=$3, location_lat=$4, location_lng=$5, metadata=$6 WHERE id=$1`,
      [panic.id, panic.timestamp, panic.status, panic.location.lat, panic.location.lng, JSON.stringify(panic.metadata || {})]
    );
  },

  async findById(id: string): Promise<Panic | undefined> {
    const { rows } = await pool.query(
      `SELECT id, timestamp, status, location_lat, location_lng, metadata FROM panic WHERE id=$1`,
      [id]
    );
    if (!rows[0]) return undefined;
    const r = rows[0];
    return {
      id: r.id,
      timestamp: Number(r.timestamp),
      status: r.status,
      location: { lat: Number(r.location_lat), lng: Number(r.location_lng) },
      metadata: r.metadata || {}
    };
  }
};
