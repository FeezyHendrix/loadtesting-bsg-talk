from locust import HttpUser, task, between

class ReservationAPITestUser(HttpUser):
    wait_time = between(1, 5)  # Simulate a wait time between 1 to 5 seconds between tasks

    @task(1)  # The decorator argument represents the weight of the task
    def get_available_dates(self):
        # Replace the parameters as needed for your specific endpoint
        self.client.get("/api/available-date?month=11&roomId=1")

    @task(1)
    def get_available_times(self):
        # Replace the parameters as needed for your specific endpoint
        self.client.get("/api/available-time?date=10&month=11&roomId=1")

    @task(1)
    def get_rooms(self):
        self.client.get("/api/rooms")
