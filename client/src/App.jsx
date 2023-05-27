import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { history } from '_helpers';
import { Nav, PrivateRoute } from '_components';
import { Home } from 'home';
import { Login } from 'login';
import { Registration } from 'register';
import { Profile } from 'profile/Profile';
import { ChatRoom } from 'chatroom/Chatroom';
import { Article } from 'articles/Articles';
import ForgotPasswordPage from 'forgot-password/ForgotPassword';
import EmailVerification from 'email-verification/emailVerification';
import ResetPasswordForm from 'reset-password/resetPassword';

export { App };

function App() {
  // init custom history object to allow navigation from 
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div className="app-container bg-light min-h-screen">
      <Nav />
      <div className="container pb-4 mx-auto">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/chatroom"
            element={
              <PrivateRoute>
                <ChatRoom />
              </PrivateRoute>
            }
          />
          <Route
            path="/articles"
            element={
              <PrivateRoute>
                <Article />
              </PrivateRoute>
            }
          />
          <Route path="/api/user/verify/:uid/:verificationToken" element={<EmailVerification />} />
          <Route path="/api/user/reset/:uid/:verificationToken" element={<ResetPasswordForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
