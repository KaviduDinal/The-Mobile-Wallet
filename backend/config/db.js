import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables before creating the connection
dotenv.config();

// Creates a sql connection using our db url
export const sql = neon(process.env.DATABASE_URL);

