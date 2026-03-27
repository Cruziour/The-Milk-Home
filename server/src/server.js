import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import app from './app.js';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error(`Failed to connect to the database: ${error.message}`);
  });
