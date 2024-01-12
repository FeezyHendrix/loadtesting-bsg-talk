import { BookingModel } from "../models/booking.model.js";
import { BookingRoomModel } from "../models/bookingRoom.model.js";
import { addHours, addMinutes, format } from "date-fns";

export const fetchAvailableDateInAMonthService = async (month, roomId) => {
  const d = new Date();
  d.setMonth(month);
  // First day of month
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  // Get the amount of days in a month
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

  const bookingsRoom = await BookingRoomModel.findById(roomId);

  /**
   * First assign all days in a month to a key <date, boolean>;
   */
  const isDateAvailableObject = {};
  for (let x = 1; x <= daysInMonth; x++) {
    isDateAvailableObject[x] = false;
  }
  /**
   * Cheeky maths here cause approximation makes these piece faster and
   * why not!
   */

  /**
   * Converts timestamp into a decimal and call the diffences.
   */
  const startTimeLength = parseFloat(
    `${new Date(bookingsRoom.openHour).getHours()}.${new Date(bookingsRoom.openHour).getMinutes()}.}`
  );
  const endTimeLength = parseFloat(
    `${new Date(bookingsRoom.closedHour).getHours()}.${new Date(bookingsRoom.closedHour).getMinutes()}.}`
  );
  const diff = endTimeLength - startTimeLength;

  const datesInArray = [];

  for (let x = 1; x <= daysInMonth; x++) {
    // Check if date has passed current date
    // So a user can't book a day that has passed
    const currentDate = new Date();
    const bookingDate = new Date();
    bookingDate.setMonth(d.getMonth());
    bookingDate.setDate(x);

    // find all booking for the day
    const allBookingsForTheDay = await BookingModel.find({ "meta.dateInMonth": x });

    // Check if the day can still accommodate a booking
    if (allBookingsForTheDay.length < diff) {
      if (bookingDate < currentDate) {
        isDateAvailableObject[x] = false;
        datesInArray.push({ day: x, valid: false });
      } else {
        isDateAvailableObject[x] = true;
        datesInArray.push({ day: x, valid: true });
      }
    } else {
      isDateAvailableObject[x] = false;
      datesInArray.push({ day: x, valid: false });
    }
  }

  const weekInDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  const result = {
    firstDay: {
      dayInWeekNumber: firstDay.getDay(),
      dayInWeekString: weekInDays[firstDay.getDay()],
    },
    datesInArray,
    isDateAvailableObject,
  };
  return result;
};

/**
 * Finds free time to book a reservation
 * @param {*} date
 * @param {*} roomId
 * @returns
 */
export const fetchTimeForDayService = async (date, month, roomId) => {
  const d = new Date();
  d.setDate(date);
  d.setMonth(month);
  /**
   * Time approximation of when the user hit's the endpoint
   */
  const currentUserTime = new Date();

  const bookingsRoom = await BookingRoomModel.findById(roomId);

  const availableTime = [];

  const allBookingsForTheDay = await BookingModel.find({ "meta.dateInMonth": d.getDate() });
  let startTime = new Date(bookingsRoom.openHour);
  const endTime = new Date(bookingsRoom.closedHour);

  console.log(startTime, endTime);

  /**
   * Check if there is actually a booking for the day
   * before running loop
   */
  const takenTimeSlots = {};
  if (allBookingsForTheDay.length > 0) {
    /**
     * Loop and assign each startTime for each timeslot as a key <startTime, bool<true>>
     */
    for (let i = 0; i < allBookingsForTheDay.length; i++) {
      const curr = allBookingsForTheDay[i];
      takenTimeSlots[curr.meta.startTime] = true;
    }
  }

  /**
   * Loop from bookings room startime to endtime while incrementing the start time
   */
  while (startTime < endTime) {
    /**
     * Check if the bookings if empty
     */
    if (allBookingsForTheDay.length > 0) {
      /**
       * Time accumator to indicate endtime of timeslot
       */
      let timeAcc;
      if (bookingsRoom.frequency.timeFactor === "minute") {
        timeAcc = addMinutes(startTime, bookingsRoom.frequency.timeCount);
      } else {
        timeAcc = addHours(startTime, bookingsRoom.frequency.timeCount);
      }

      /**
       * If startTime isn't in takeTimeSlot object add to available time
       */
      if (!takenTimeSlots[`${startTime.getHours()}.${startTime.getMinutes()}`]) {
        if (startTime.getHours() > currentUserTime.getHours()) {
          availableTime.push({
            value: {
              start: startTime,
              end: timeAcc,
            },
            option: `${format(startTime, "h:mmaaa")} - ${format(timeAcc, "h:mmaaa")}`,
          });
        }
      }

      if (bookingsRoom.frequency.timeFactor === "minute") {
        startTime = addMinutes(startTime, bookingsRoom.frequency.timeCount);
      } else {
        startTime = addHours(startTime, bookingsRoom.frequency.timeCount);
      }
    } else {
      console.log("HERE 2");
      /**
       * If the bookings is empty and all timeslots are free
       */
      let timeAcc;

      /**
       * Increment time accumulator
       */
      if (bookingsRoom.frequency.timeFactor === "minute") {
        timeAcc = addMinutes(startTime, bookingsRoom.frequency.timeCount);
      } else {
        timeAcc = addHours(startTime, bookingsRoom.frequency.timeCount);
      }

      /**
       * Push the available time
       */
      availableTime.push({
        value: {
          start: startTime,
          end: timeAcc,
        },
        option: `${format(startTime, "h:mmaaa")} - ${format(timeAcc, "h:mmaaa")}`,
      });

      /**
       * Increment start time by appropriate frequency
       */
      if (bookingsRoom.frequency.timeFactor === "minute") {
        startTime = addMinutes(startTime, bookingsRoom.frequency.timeCount);
      } else {
        startTime = addHours(startTime, bookingsRoom.frequency.timeCount);
      }
    }
  }

  return availableTime;
};

export const fetchAllRoomService = async () => {
  const result = await BookingRoomModel.find();
  return result;
};
