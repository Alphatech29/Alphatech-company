const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const logger = require('./middleWare/logger');
const authRoute = require("./routes/auths");
const generalRoute = require("./routes/general");
const { upload, uploadErrorHandler } = require('./utilities/multerConfig');

dotenv.config();
const app = express();

// ===== Trust Proxy Setting =====
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
} else {
  app.set("trust proxy", "loopback");
}

// ===== Security Middleware =====
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// ===== Rate Limiting (IPv6-safe) =====
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// ===== Body Parsing Middleware =====
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===== Force HTTPS in production =====
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && !req.secure) {
    const host = req.headers.host.split(":")[0];
    return res.redirect(301, `https://${host}${req.url}`);
  }
  next();
});

// ===== File Upload Middleware =====
app.use("/api", upload.any());

// ===== Routes =====
app.use("/auth", authRoute);
app.use("/api", generalRoute);

// ===== Serve Uploads Folder =====
const uploadsPath = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// ===== Serve SPA (React/Vue build) =====
const staticPath = path.join(__dirname, "views", "dist");
app.use(express.static(staticPath));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"), err => {
    if (err) {
      console.error("Failed to serve index.html:", err);
      res.status(500).send("Internal server error.");
    }
  });
});

// ===== Global Error Handler =====
app.use(uploadErrorHandler);
app.use((err, req, res, next) => {
  logger.error(err.message, {
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

// ===== Server Setup =====
const HTTP_PORT = process.env.HTTP_PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

if (process.env.NODE_ENV === "production") {
  const keyPath = path.join(__dirname, "certs/server.key");
  const certPath = path.join(__dirname, "certs/server.crt");

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error("SSL certificates not found. Cannot start HTTPS server.");
    process.exit(1);
  }

  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server running on https://localhost`);
  });

  http.createServer((req, res) => {
    const host = req.headers.host.split(":")[0];
    res.writeHead(301, { Location: `https://${host}${req.url}` });
    res.end();
  }).listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on http://localhost and redirecting to HTTPS`);
  });

} else {
  app.listen(HTTP_PORT, () => {
    console.log(`Server running in development on http://localhost:${HTTP_PORT}`);
  });
}
