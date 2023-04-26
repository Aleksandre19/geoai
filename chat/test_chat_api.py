from datetime import datetime

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from pytz import UTC
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from chat.models import Answer

class PostApiTestCase(TestCase):
  def setUp(self):
    self.u1 = get_user_model().objects.create_user(
      email="test@example.com", password="password"
    )

    self.u2 = get_user_model().objects.create_user(
      email="test2@example.com", password="password2"
    )

    answers = [
      Answer.objects.create(
        user=self.u1,
        content="Post 1 Content",
      ),
      Answer.objects.create(
        user=self.u2,
        content="Post 2 Content",
      ),
    ]

    # let us look up the post info by ID
    self.answer_lookup = {p.id : p for p in answers}

    # override test client
    self.client = APIClient()
    token = Token.objects.create(user=self.u1)
    self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

  def test_answer_list(self):
    resp = self.client.get("/api/answers/")
    data = resp.json()
    self.assertEqual(len(data), 2)

    for answer_dict in data:
      answer_obj = self.answer_lookup[answer_dict["id"]]
      self.assertEqual(answer_obj.content, answer_dict["content"])
      self.assertTrue(
        answer_dict["user"].endswith(f"/api/users/{answer_obj.user.email}")
      )
      self.assertEqual(
          answer_obj.created_at,
          datetime.strptime(
              answer_dict["created_at"], "%Y-%m-%dT%H:%M:%S.%fz"
          ).replace(tzinfo=UTC),
      )
  
  def test_unauthenticated_answer_create(self):
      # unset credentials so we are an anonymous user
      self.client.credentials()
      answer_dict = {
          "user": "http://testserver/api/users/test@example.com",
          "content": "Test Content",
          "created_at": "2021-01-10T09:00:00Z",
      }

      resp = self.client.post("/api/answers/", answer_dict)
      self.assertEqual(resp.status_code, 401)
      self.assertEqual(Answer.objects.all().count(), 2)


  def test_answer_create(self):
      answer_dict = {
          "user": "http://testserver/api/users/test@example.com",
          "content": "Test Content",
        #   "created_at": "2021-01-10T09:00:00Z",
      }
      resp = self.client.post("/api/answers/", answer_dict)
      answer_id = resp.json()["id"]
      answer = Answer.objects.get(pk=answer_id)
      self.assertEqual(answer.content, answer_dict["content"])
      self.assertEqual(answer.user, self.u1)
    #   self.assertEqual(answer.created_at, datetime(2021, 1, 10, 9, 0, 0, tzinfo=UTC))