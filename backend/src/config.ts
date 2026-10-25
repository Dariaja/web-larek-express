import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

export const PORT = Number(process.env.PORT) || 3000;

export const DB_ADDRESS = process.env.DB_ADDRESS
  || 'mongodb://127.0.0.1:27017/weblarek';
