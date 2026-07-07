import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:2017/task_management';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' Database connection successfully established');
    app.listen(PORT, () => {
      console.log(` Server listening smoothly on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Database connection failed:', err);
    process.exit(1);
  });