from django.db import models
from accounts.models import User
# Create your models here.
class group(models.Model):
    groupname=models.CharField(max_length=100,unique=True)

    def __str__(self) -> str:
        return self.groupname

class chat(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    group=models.ForeignKey("chatroom.group", on_delete=models.CASCADE)
    content=models.CharField(max_length=200)
    timestamp=models.DateTimeField( auto_now=True)
    