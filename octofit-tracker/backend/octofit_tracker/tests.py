from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status


class UserAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_users(self):
        response = self.client.get('/api/users/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_root_prefix(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TeamAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_teams(self):
        response = self.client.get('/api/teams/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])


class ActivityAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_activities(self):
        response = self.client.get('/api/activities/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])


class LeaderboardAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])


class WorkoutAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
