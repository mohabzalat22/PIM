import { appendFile } from "fs/promises";

const logger = (req, res, next) => {
  const start = Date.now();
  const dir = "src/logs/";

  const environmentLogs = {
    production: "production.txt",
    staging: "staging.txt",
    development: "development.txt",
  };
  const env = process.env.NODE_ENV;

  res.on("finish", async () => {
    if (env in environmentLogs) {
      const fileName = environmentLogs[env];
      if (!fileName) throw new Error("Error in logging environment file");
      // file name
      const duration = Date.now() - start;
      const logLine = `${req.method}  ${req.originalUrl}  ${res.statusCode}  ${duration}ms \n`;
      try {
        await appendFile(dir + fileName, logLine);
      } catch (err) {
        next(err);
      }
    }
  });

  next();
};

export default logger;
