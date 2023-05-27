from celery import shared_task
from django.core.mail import send_mail
from .models import *


@shared_task
def verify_mail_task(username, useremail,link):
    send_mail(
        'This is verification link ',
        'Hi ' + username + "!  " + '\n'+'Below is the verification link.'+'\n'+ link ,
        '',
        [useremail],
        fail_silently=False,
    )
    print("MAIL FROM CELERY")
    return None


@shared_task
def Registration_mail_task(username, useremail):
    send_mail(
        'welcome mail to new user',
        'Hi ' + username + "! you have registered successfully in our Vocabulary-Central website",
        '',
        [useremail],
        fail_silently=False,
    )
    print("Registration MAIL FROM CELERY")
    return None
