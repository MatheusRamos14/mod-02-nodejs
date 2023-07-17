import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
} else {
  config({ path: '.env' });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite3', 'pg']),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const errors = Object.keys(_env.error.format()).slice(1);

  throw new Error(`Server missing enviroment variables: ${errors.join(' | ')}`);
}

export const env = _env.data;
