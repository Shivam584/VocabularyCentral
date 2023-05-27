from django.urls import path,include
from accounts.views import *
urlpatterns = [
path('register/',userRegistration.as_view(),name='register'),
path('login/',userLogin.as_view(),name='login'),
path('profile/',userProfile.as_view(),name='profile'),
path('change/',userChangePassword.as_view(),name='changePassword'),
path('mail/',userVerifyMail.as_view(),name='VerifyMail'),
path('reset/<uid>/<token>/',userResetPassword.as_view(),name='resetPasssword'),
path('verify/<uid>/<token>/',userEmailVerification.as_view(),name='verifyMailID'),

]
