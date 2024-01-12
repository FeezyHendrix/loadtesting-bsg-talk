import { catchAsync, getFullUrl, queryParser, replyHttp } from "../utils.js";
import { fetchAllRoomService, fetchAvailableDateInAMonthService, fetchTimeForDayService } from "./reservation.service.js";

export const fetchAvailableDateInAMonthController = catchAsync(async (req, res) => {
  
  const query = queryParser(getFullUrl(req));
  const data = await fetchAvailableDateInAMonthService(query.month, query.roomId);
  replyHttp(200, "Succesful", res, data);
});

export const fetchTimeForDayController = catchAsync(async (req, res) => {
  const query = queryParser(getFullUrl(req));
  const data = await fetchTimeForDayService(query.date, query.month, query.roomId);
  replyHttp(200, "Succesful", res, data);
});

export const fetchAllRoomController = catchAsync(async (req, res) => {
  const data = await fetchAllRoomService();
  replyHttp(200, "Succesful", res, data);
});
