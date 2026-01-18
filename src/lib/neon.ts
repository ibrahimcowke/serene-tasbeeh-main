import { neon } from '@netlify/neon';

// Initialize the SQL connection
// Only works if NETLIFY_DATABASE_URL is set in environment variables
// For usage in frontend (Vite), ensure the variable is prefixed with VITE_ 
// or manually passed to the neon function.
// Note: Direct database access from client-side is generally not recommended for production apps due to security risks.

const connectionString = 
  import.meta.env.VITE_DATABASE_URL || 
  import.meta.env.NETLIFY_DATABASE_URL;

export const sql = neon(connectionString);
