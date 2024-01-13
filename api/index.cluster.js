import http from "http";
import cluster from "cluster";
import { cpus } from "os";
import { getFullUrl, match, replyHttp } from "./utils.js";
import {
  fetchAllRoomController,
  fetchAvailableDateInAMonthController,
  fetchTimeForDayController,
} from "./internals/reservation.controller.js";
import "dotenv/config";
import mongoose from "mongoose";
import { fireSeeder } from "./models/db.seed.js";

const numCPUs = cpus().length;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  const server = http.createServer((req, res) => {
    try {
      const baseURL = getFullUrl(req);
      const parsedUrl = new URL(baseURL);
      const pathname = parsedUrl.pathname;
      console.log(`Worker ${process.pid} hit: ${req.url}`);

      match(pathname, {
        "/api/available-date": () => fetchAvailableDateInAMonthController(req, res),
        "/api/available-time": () => fetchTimeForDayController(req, res),
        "/api/rooms": () => fetchAllRoomController(req, res),
        "/": () => replyHttp(200, "PING", res),
      });
    } catch (e) {
      replyHttp(404, "Not Found", res, null, { "Content-Type": "text/plain" });
    }
  });

  server.listen(process.env.PORT, () => {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.DB_URI, {
        retryWrites: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        fireSeeder();
        console.log(`Worker ${process.pid} started`);
        console.log(`=================================`);
        console.log(`======= ENV: ${process.env.NODE_ENV} =======`);
        console.log(`🚀 App listening on the port ${process.env.PORT}`);
        console.log(`======= Connected to MongoDB ====`);
        console.log(`=================================`);
      });
  });
}
