import http from "http";
import { getFullUrl, match, replyHttp } from "./utils.js";
import { fetchAllRoomController, fetchAvailableDateInAMonthController, fetchTimeForDayController } from "./internals/reservation.controller.js";
import "dotenv/config";
import mongoose from "mongoose";
import { fireSeeder } from "./models/db.seed.js";

const server = http.createServer((req, res) => {
  try {
    const baseURL = getFullUrl(req);
    const parsedUrl = new URL(baseURL);
    const pathname = parsedUrl.pathname;
    console.log(`hit: ${req.url}`);

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

// The server listens on port 3000
server.listen(process.env.PORT, () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.DB_URI, {
      retryWrites: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      // fireSeeder();
      console.log(`=================================`);
      console.log(`======= ENV: ${process.env.NODE_ENV} =======`);
      console.log(`🚀 App listening on the port ${process.env.PORT}`);
      console.log(`======= Connected to MongoDB ====`);
      console.log(`=================================`);
    });
});
