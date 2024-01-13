import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metric for tracking error rates
let errorRate = new Rate('errors');

export let options = {
    stages: [
        { duration: '10s', target: 100 }, // Ramp-up to 100 users over 10s
        { duration: '10s', target: 100 }, // Stay at 100 users for 10s
        { duration: '10s', target: 200 }, // Ramp-up to 200 users over 10s
        { duration: '20s', target: 1000 }, // Stay at 200 users for 20s
        { duration: '30s', target: 10000 }, // Stay at 10000 users for 30s
        { duration: '10s', target: 0 },    // Ramp-down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% of requests should be below 500ms
        'errors': ['rate<0.01'], // Error rate should be below 1%
    },
};


const ID = "65a1a419cea619adbc35dc9e";

export default function () {
    // Testing http://localhost:3000/api/rooms
    let response = http.get('http://localhost:3000/api/rooms');
    check(response, { 'status was 200': (r) => r.status == 200 }) || errorRate.add(1);
    sleep(1);

    // Testing http://localhost:3000/api/available-date with query parameters
    response = http.get('http://localhost:3000/api/available-date?month=11&roomId=' + ID);
    check(response, { 'status was 200': (r) => r.status == 200 }) || errorRate.add(1);
    sleep(1);

    // Testing /api/available-time with query parameters
    response = http.get('http://localhost:3000/api/available-time?date=10&month=11&roomId=' + ID);
    check(response, { 'status was 200': (r) => r.status == 200 }) || errorRate.add(1);
    sleep(1);
}
