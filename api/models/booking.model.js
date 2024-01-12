import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema(
  {
    start: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    meta: {
      startTime: {
        type: String,
      },
      stopTime: {
        type: String,
      },
      dateInMonth: {
        type: Number,
      },
    },
    details: {
      type: String,
    },
    bookingsroom: {
      type: mongoose.Types.ObjectId,
      default: null,
      required: true,
      ref: 'BookingRoom',
    },
    status: {
      type: String,
      enum: ['completed', 'rescheduled', 'pending'],
    },
    rescheduledBooking: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel = mongoose.model('Booking', bookingsSchema);
