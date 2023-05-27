import React from 'react';
import { useSelector } from 'react-redux';

import UserService from '_services/user.service';

export {Profile}

function Profile () {
  // Dummy user data
  // const user = {
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   email: 'johndoe@example.com',
  //   isEmailVerified: false,
  //   username: 'johndoe',
  //   profileImageUrl: 'https://dummyimage.com/200x200/ccc/000.jpg',
  // };

  const { user } = useSelector(x => x.auth);

  return (
    <div className="w-full lg:w-4/12 px-4 mx-auto pt-28">
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-2xl border-2 rounded-lg mt-16">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-4 flex justify-center">
              <div className="relative">
                <img
                  alt="Profile"
                  src={user.profileImageUrl? user.profileImageUrl : "https://dummyimage.com/200x200/ccc/000.jpg"}
                  className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                />
              </div>
            </div>
          </div>
          <div className="text-center mt-12 pt-12 pb-12">
            <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                {user.firstName} {user.lastName}
            </h3>
            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold">
                <i className="fas fa-envelope mr-2 text-lg text-blueGray-400"></i>
                    {user.email}
            </div>
            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold">
                <i className="fas fa-user mr-2 text-lg text-blueGray-400"></i>
                  {user.username}
            </div>
            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold">
                {/* email verification status*/}
                {user.is_verified ? (
                    <span className="text-green-500 mr-2">
                        <i className="fas fa-check-circle mr-2 text-lg"></i>
                        Email Verified
                    </span>
                ) : (
                    <span className="text-red-500 mr-2">
                        <i className="fas fa-times-circle mr-2 text-lg"></i>
                        Email Not Verified
                    </span>
                )}
            </div>
            {/* if email not verified show a button to verify*/}
            {!user.is_verified && (
                <button
                onClick={
                  async () => {
                    const res = await UserService.sendMailForVerification(user.username, user.email)
                    console.log(res)
                    if (res.status === 201) {
                      alert("Verification email sent successfully")
                    }
                  }
                }
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                Verify Email
              </button>
              
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// export default Profile;
