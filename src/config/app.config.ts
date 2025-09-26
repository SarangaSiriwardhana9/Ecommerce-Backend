import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  universityName: process.env.UNIVERSITY_NAME || 'University Name',
  academicYear: process.env.ACADEMIC_YEAR || '2024/2025',
  currentSemester: parseInt(process.env.CURRENT_SEMESTER, 10) || 1,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
  uploadPath: process.env.UPLOAD_PATH || './uploads',
}));