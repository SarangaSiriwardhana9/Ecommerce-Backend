import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  mongoUri:
    process.env.MONGODB_URI ||
    'mongodb+srv://root:1234@cluster0.wzfoc5k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
}));
