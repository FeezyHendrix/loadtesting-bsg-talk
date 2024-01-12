import { BookingModel } from "./booking.model.js";
import { BookingRoomModel } from "./bookingRoom.model.js";




function seedBookingRooms() {
  const seedData = [
    {
      name: "Conference Room A",
      isAvailable: true,
      accessLevel: 'someObjectId1', // Replace with actual ObjectId references
      description: "A large room suitable for meetings and conferences.",
      frequency: {
        timeFactor: 'hour',
        timeCount: 2,
      },
      openHour: new Date(new Date().setHours(8, 0, 0, 0)),
      closedHour: new Date(new Date().setHours(20, 0, 0, 0)),
    },
    {
      name: "Small Meeting Room",
      isAvailable: false,
      accessLevel: 'someObjectId2',
      description: "Perfect for small team meetings.",
      frequency: {
        timeFactor: 'minute',
        timeCount: 45,
      },
      openHour: new Date(new Date().setHours(9, 0, 0, 0)),
      closedHour: new Date(new Date().setHours(18, 0, 0, 0)),
    },
  ];
  
  console.log(`=================================`);
  BookingRoomModel.insertMany(seedData).then(console.log('Seeder: Booking rooms seed done'));
  console.log(`=================================`);
}

export async function fireSeeder() {
  /// Delete existing data to not create confusion
  await BookingModel.deleteMany();
  await BookingRoomModel.deleteMany();


  seedBookingRooms();
}