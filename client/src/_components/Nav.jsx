import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '_store';

export { Nav };

function Nav() {
  const authUser = useSelector((x) => x.auth.user);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());

  return (
    <nav className="bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-1">
          <div className="flex items-center">
            <NavLink to="/" className="text-white text-xl font-semibold nav-link">
              Vocabulary Central
            </NavLink>
          </div>
          {authUser ? (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/articles"
                className="text-gray-300 transition duration-300 ease-in-out nav-link"
                activeClassName="text-white"
              >
                Articles
              </NavLink>
              <NavLink
                to="/chatroom"
                className="text-gray-300 transition duration-300 ease-in-out nav-link"
                activeClassName="text-white"
              >
                Chatroom
              </NavLink>
              <NavLink
                to="/profile"
                className="text-gray-300 transition duration-300 ease-in-out nav-link"
                activeClassName="text-white"
              >
                Profile
              </NavLink>
              <button
                onClick={logout}
                className="text-gray-300 transition duration-300 ease-in-out nav-link"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/signin"
                className="text-gray-300 transition duration-300 ease-in-out nav-link"
                activeClassName="text-white"
              >
                Signin
              </NavLink>
              <NavLink
                to="/signup"
                className="text-gray-300 transition duration-300 ease-in-out nav-link"
                activeClassName="text-white"
              >
                Signup
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
