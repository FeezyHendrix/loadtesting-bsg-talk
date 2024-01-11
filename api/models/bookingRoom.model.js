const mongoose = require('mongoose');

const bookingsRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    accessLevel: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'accesslevel',
    },
    description: {
      type: String,
    },
    frequency: {
      timeFactor: {
        type: String,
        default: 'minute',
        enum: ['minute', 'hour'],
      },
      timeCount: {
        type: Number,
        default: 30,
      },
    },
    openHour: {
      type: Date,
      default: new Date(new Date().setHours(8, 0, 0, 0)),
    },
    closedHour: {
      type: Date,
      default: new Date(new Date()).setHours(20, 0, 0, 0),
    },
  },
  {
    timestamps: true,
  }
);

export const BookingRoomModel = mongoose.model('BookingRoom', bookingsRoomSchema);
