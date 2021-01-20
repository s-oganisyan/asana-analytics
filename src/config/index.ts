import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  PORT: process.env.PORT ? process.env.PORT : '3000',
  ASANA_PERSONAL_ACCESS_TOKEN: process.env.ASANA_PERSONAL_ACCESS_TOKEN,
  WORKSPACE: process.env.WORKSPACE,
  TIME_RESPONSE_DATA: 12,
};
