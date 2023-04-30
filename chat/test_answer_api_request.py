from django.test import LiveServerTestCase
from requests.auth import HTTPBasicAuth
from rest_framework.test import RequestsClient

from django.contrib.auth import get_user_model
from chat.models import Answer


class AnswerApiTestCase(LiveServerTestCase):
    def setUp(self):
        get_user_model().objects.create_user(
            email="testuser@example.com", password="password"
        )

        self.user = get_user_model().objects.get(email="testuser@example.com")

        self.answer_values = {"answer1", "answer2", "answer3", "answer4"}
        for a in self.answer_values:
            Answer.objects.create(user=self.user, content=a)
        self.client = RequestsClient()

    def test_answer_list(self):
        self.client.auth = HTTPBasicAuth("testuser@example.com", "password")
        resp = self.client.get(self.live_server_url + "/api/answers/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()['results']
        self.assertEqual(len(data), 4)
        self.assertEqual(self.answer_values, {a["content"] for a in data})

    def test_answer_create_basic_auth(self):
        self.client.auth = HTTPBasicAuth("testuser@example.com", "password")
        resp = self.client.post(
            self.live_server_url + "/api/answers/",
            {
                "user": f"{self.live_server_url}/api/users/{self.client.auth.username}",
                "content": "answer5"
            }
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Answer.objects.all().count(), 5)

    def test_answer_create_token_auth(self):
        token_resp = self.client.post(
            self.live_server_url + "/api/token-auth/",
            {"username": "testuser@example.com", "password": "password"},
        )
        self.client.headers["Authorization"] = "Token " + token_resp.json()["token"]

        resp = self.client.post(
            self.live_server_url + "/api/answers/", 
            {
                "user": f"{self.live_server_url}/api/users/testuser@example.com",
                "content": "answer5"
            }
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Answer.objects.all().count(), 5)