# Node.js Reservation API

This project is a Node.js API for managing room bookings and reservations. It was prepared for a talk I had on load testing your API . It utilizes MongoDB for data storage and provides endpoints for fetching available dates, available times, and room information. 

## Features

- Fetch available dates in a month for a specific room
- Fetch available time slots for a specific day and room
- List all available rooms

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js](https://nodejs.org/)
- You have a MongoDB server running or access to a MongoDB instance

## Installing Node.js Reservation API

To install the API, follow these steps:

```bash
git clone https://github.com/FeezyHendrix/loadtesting-bsg-talk.git
cd loadtesting-bsg-talk
yarn install
```

## Configuration

Create a `.env` file in the root directory of the project and from the `.env.example`
```

Replace `mongodb://127.0.0.1:27017/loadtesting` with your actual MongoDB URI.

## Running the API

To run the API, use the following command:

```bash
yarn start
```

The server will start and listen on the port defined in your `.env` file (default is 3000).

## API Endpoints

The API provides the following endpoints:

- `GET /api/available-date`: Fetch available dates in a month for a specific room. Query parameters: `month`, `roomId`.
- `GET /api/available-time`: Fetch available time slots for a specific day and room. Query parameters: `date`, `month`, `roomId`.
- `GET /api/rooms`: List all available rooms.

## Contributing to Node.js Reservation API

To contribute to the API, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b branch_name`.
3. Make your changes and commit them: `git commit -m 'commit_message'`.
4. Push to the original branch: `git push origin branch_name`.
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## Contact

If you have any questions or feedback, please contact `switchdevelop1@gmail.com`.

