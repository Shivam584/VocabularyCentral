from rest_framework import serializers
from accounts.models import User
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .tasks import *
class UserRegistrationSerializer(serializers.ModelSerializer):
    password2=serializers.CharField(style={'input_type' : 'password'},write_only=True)
    class Meta:
        model=User
        fields=['email','username','firstName','lastName','password','password2']
        extra_kwargs={
            'password':{'write_only' : True}
        }

    
    def validate(self,attrs):
        password=attrs.get('password')
        password2=attrs.get('password2')
        email=attrs.get('email')
        firstName=attrs.get('firstName')
        if password != password2:
            raise serializers.ValidationError("password doesn't match.")
        Registration_mail_task.delay(firstName,email)
        return attrs
    
    def create(self, validated_data):

        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.ModelSerializer):
    username=serializers.CharField()
    class Meta:
        model=User
        fields=['username','password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','firstName','lastName','email', 'is_verified']

    
class userChangePasswordSerializer(serializers.Serializer):
    password=serializers.CharField(max_length=255,style={'input_type' : 'password'},write_only=True)
    password2 = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True)
    class Meta:
        fields=['password','password2']
    def validate(self, attrs):
        password=attrs.get('password')
        password2=attrs.get('password2')
        user=self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("password doesn't match.")
        else:
            user.set_password(password)
            user.save()
        return attrs
    
class userVerifyMailSerializer(serializers.Serializer):
    email=serializers.EmailField(max_length=255)
    username=serializers.CharField(max_length=255)
    
    def validate(self, attrs):
        email=attrs.get('email')
        username=attrs.get('username')
        if not User.objects.filter(email=email,username=username).exists():
            return serializers.ValidationError("email or username doesn't match")
        else:
            user=User.objects.get(email=email,username=username)
            uid=urlsafe_base64_encode(force_bytes(user.id))
            print(uid)
            token=PasswordResetTokenGenerator().make_token(user=user)
            print(token)
            link ='http://localhost:3000/api/user/reset/'+uid+'/'+token+'/'
            print(link)
            verify_mail_task.delay(user.firstName,email,link)
            return attrs
    
class userResetPasswordSerializer(serializers.Serializer):
    password=serializers.CharField(max_length=255,style={'input_type' : 'password'},write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    class Meta:
        fields=['password','password2']
    def validate(self, attrs):
        try:
            password=attrs.get('password')
            password2=attrs.get('password2')
            uid=self.context.get('uid')
            token=self.context.get('token')
            if password != password2:
                raise serializers.ValidationError("password doesn't match.")
            id=smart_str(urlsafe_base64_decode(uid))
            user=User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user,token):
                raise serializers.ValidationError("token is invalid or expired")
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError :
            if not PasswordResetTokenGenerator().check_token(user,token):
                raise serializers.ValidationError("token is invalid or expired")


            

