import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TOKEN;

const config = {
  prefix: '?acbot ',
  token: token,
};

export { config };
