import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import UserService from '_services/user.service';

function EmailVerification() {
  const navigate = useNavigate();
  const { uid, verificationToken } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // const url = `http://localhost:3000/api/user/reset/${userId}/${verificationToken}`;
        // const response = await fetch(url, {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        const response = await UserService.mailVerification(uid, verificationToken)
        console.log(response)
        if (response.status === 201) {
          // Redirect to the home page upon successful response
          let user = JSON.parse(localStorage.getItem('user'))
            user.is_verified = true
            localStorage.setItem('user', JSON.stringify(user))
          navigate('/');
          
        //   page  reload
          window.location.reload();
        }
      } catch (error) {
        console.error('Email verification failed:', error);
      }
    };

    verifyEmail();
  }, []); // Empty dependency array to run the effect only once

  return null; // Placeholder for your component's return value
}

export default EmailVerification;
