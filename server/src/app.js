import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// import routes
import userRoutes from './routes/user.routes.js';

// use routes
app.use('/api/v1/user', userRoutes);

// import error handler
import errorHandler from './middlewares/error.middleware.js';

// use error handler middleware
app.use(errorHandler);

export default app;
