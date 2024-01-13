from locust import HttpUser, task, between

id = "65a1a419cea619adbc35dc9e"

class APIUser(HttpUser):
    wait_time = between(1, 2)  # Average wait time between tasks

    @task
    def get_rooms(self):
        with self.client.get("/api/rooms", catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Failed! Status code: {response.status_code}")

    @task
    def get_available_dates(self):
        with self.client.get("/api/available-date?month=11&roomId=" + id, catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Failed! Status code: {response.status_code}")

    @task
    def get_available_times(self):
        with self.client.get("/api/available-time?date=10&month=11&roomId=" + id, catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Failed! Status code: {response.status_code}")
