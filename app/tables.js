import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
let sslValue = true;
if (process.env.NODE_ENV === 'local') {
  sslValue = false;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: sslValue });

pool.on('connect', () => {
  console.log('connected to the db');
});

class Tables {
  dropAlltables() {
    const queryText = `
    DROP TABLE IF EXISTS category CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS foods CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    `;
    pool.query(queryText)
      .then((result) => {
        console.log(result);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }

  createAlltables() {
    const queryText = `
    CREATE TABLE IF NOT EXISTS
      category(
        category_id SERIAL PRIMARY KEY,
        category_name VARCHAR(225) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS
      users(
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(225) NOT NULL,
        full_name VARCHAR(225) NOT NULL,
        email VARCHAR(225) NOT NULL,
        password VARCHAR(225) NOT NULL,
        user_type VARCHAR(128) NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS
      foods(
        food_id SERIAL PRIMARY KEY,
        food_name VARCHAR(225) NOT NULL,
        category_id INTEGER NOT NULL,
        price NUMERIC NOT NULL,
        description VARCHAR NOT NULL,
        image VARCHAR NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY(category_id) REFERENCES category(category_id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS
      orders(
        order_id SERIAL PRIMARY KEY,
        food_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        amount NUMERIC NOT NULL,
        order_status VARCHAR(128) NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY(food_id) REFERENCES foods(food_id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS
      admin(
        admin_id SERIAL PRIMARY KEY,
        email VARCHAR(225) NOT NULL,
        password VARCHAR(225) NOT NULL
      );`;
    pool.query(queryText)
      .then((result) => {
        console.log(result);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }

  insertAdmin() {
    const queryText = `
    INSERT INTO users(
      username, full_name, email, password, user_type, created_at, 
      updated_at)
      VALUES ('admin', 'admin', 'admin@mailinator.com', '1234567', 'Admin', '2018-10-02 13:07:58.188',
      '2018-10-02 13:07:58.188');`;
    pool.query(queryText)
      .then((result) => {
        console.log(result);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }

  insertCategory() {
    const queryText = `
    INSERT INTO category(
      category_name)
      VALUES ('meals');`;
    pool.query(queryText)
      .then((result) => {
        console.log(result);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }

  insertFood() {
    const queryText = `
    INSERT INTO foods(
      food_name, category_id, price, description, image, created_at
      updated_at)
      VALUES ('chicken', '2', '3000', 'good food', 'images.google.com', '2018-10-02 13:07:58.188',
      '2018-10-02 13:07:58.188');`;
    pool.query(queryText)
      .then((result) => {
        console.log(result);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

const createTables = new Tables();
export default createTables;

//  createTables.dropAlltables();
