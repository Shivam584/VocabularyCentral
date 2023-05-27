from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from accounts.serializers import *
from accounts.renders import *
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
# jwt token generatior
from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class userRegistration(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user=user)
            return Response({'msg': "register successfully", "token": token}, status=status.HTTP_201_CREATED)
        return Response({'msg': serializer.errors}, status=status.HTTP_406_NOT_ACCEPTABLE)


class userLogin(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                token = get_tokens_for_user(user=user)
                return Response({'msg': "Login successfully", "token": token}, status=status.HTTP_201_CREATED)
            else:
                return Response({'errors': {'non_fields_errors': ['Username or Password is not valid']}}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class userProfile(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class userChangePassword(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = userChangePasswordSerializer(
            data=request.data, context={'user': request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': "password changed successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class userVerifyMail(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = userVerifyMailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': "link is send to you given mail"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class userResetPassword(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = userResetPasswordSerializer(
            data=request.data, context={'uid': uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': "password reset successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class userEmailVerification(APIView):
    renderer_classes = [UserRenderer]
    # permission_classes=[IsAuthenticated]
    def post(self, request, uid, token, format=None):
        id=smart_str(urlsafe_base64_decode(uid))
        user=User.objects.get(id=id)
        if PasswordResetTokenGenerator().check_token(user,token):
            user.is_verified=True
            user.save()
            return Response({'msg': "Email is verified successfully"}, status=status.HTTP_201_CREATED)
        return Response({'errors': "Invalid or Expired token"}, status=status.HTTP_400_BAD_REQUEST)
