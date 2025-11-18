require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/admin-auth_routes/admin_auth");
const leaderRouter = require("./routes/leader_routes/leader");
const teamRouter = require("./routes/team-routes/team"); 
const organizationRouter = require("./routes/organization_routes/organization");
const emailRouter = require("./routes/email_routes/email");


const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5137', 
  methods: ['GET', 'POST', 'DELETE', 'PUT','PATCH', 'OPTIONS'],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma"
  ],
  credentials: true,
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(hpp({
  whitelist: [
    'sort', 'limit', 'page', 'fields' 
  ]
}));


const limiter = rateLimit({
  max: 100, 
  windowMs: 15 * 60 * 1000, 
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

app.use("/api/auth", authRouter);
app.use("/api/leaders", leaderRouter);
app.use("/api/teams", teamRouter);
app.use("/api/organizations", organizationRouter);
app.use("/api/emails", emailRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'EcoLeader Platform API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.name} - ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

const server = app.listen(PORT, async () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
  
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.name} - ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});