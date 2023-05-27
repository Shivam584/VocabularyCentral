import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '_helpers';
// import { authActions } from '_store';
import { useNavigate } from 'react-router-dom';

import UserService from '_services/user.service';

export { Registration };

function Registration() {
    const [passwordVisible, setPasswordVisible] = useState(false)

    const navigate = useNavigate();

    // const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth.user);
    const authError = useSelector(x => x.auth.error);

    useEffect(() => {
        // redirect to home if already logged in
        if (authUser) history.navigate('/');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        username: Yup.string().required('Username is required'),
        email: Yup.string().required('Email is required').email('Invalid email'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    async function onSubmit({ firstName, lastName, username, email, password, confirmPassword }) {
        // return dispatch(authActions.register({ firstName, lastName, username, email, password }));
        const data = await UserService.register({ firstName, lastName, username, email, password, confirmPassword })
        console.log(data)
        if (data.status < 300 && data.status > 199) {
            navigate("/signin")
        }
            
    }

    return (
        <>
            <div className="flex items-center justify-center py-28">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border-2 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Register</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    name="firstName"
                                    type="text"
                                    {...register('firstName')}
                                    className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
                                        errors.firstName ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    name="lastName"
                                    type="text"
                                    {...register('lastName')}
                                    className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
                                        errors.lastName ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    name="username"
                                    type="text"
                                    {...register('username')}
                                    className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
                                        errors.username ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    {...register('email')}
                                    className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
                                        errors.email ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        {...register('password')}
                                        className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
                                            errors.password ? 'ring-2 ring-red-500' : ''
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-gray-500"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 12a2 2 0 100-4 2 2 0 000 4zm1.014-1.898c.288-.712.748-1.234 1.324-1.637C14.06 7.665 15 6.657 15 5a5 5 0 00-9.708-1.415c.41.942.984 1.697 1.728 2.25C7.25 7.027 8.09 7.286 9 7.55v1.059a3.498 3.498 0 00-1-.222C6.093 8.386 5.107 8.5 4 8.5c-1.807 0-3.415-.834-4-2.083A4 4 0 019.33 3.875c.096.454.296.873.584 1.227A4.976 4.976 0 0110 5a4.976 4.976 0 01-.086.875 3.98 3.98 0 01-.584 1.227 4 4 0 01-.997 1.091C8.277 8.186 9 8.765 9 9.5v2c0 .288.034.568.097.838z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 12a5 5 0 100-10 5 5 0 000 10zm1.414-5.707a1 1 0 00-1.414-1.414l-2 2a1 1 0 001.414 1.414L10 9.414l1.414 1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    {...register('confirmPassword')}
                                    className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
                                        errors.confirmPassword ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="text-sm">
                                <p>
                                    Already have an account?{' '}
                                    <a href="/signin" className="text-primary-600 hover:underline">
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 text-white font-medium rounded-lg"
                        >
                            {isSubmitting ? (
                                <span className="spinner-border spinner-border-sm mr-1"></span>
                            ) : (
                                'Register'
                            )}
                        </button>
                        {authError && (
                            <div className="text-red-500 text-sm mt-3">{authError.message}</div>
                        )}
                    </form>
                </div>
            </div>
        </>
        // <div className="flex items-center justify-center h-screen bg-gray-100">
        //     <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        //         <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Register</h1>
        //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        //             <div>
        //                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
        //                     First Name
        //                 </label>
        //                 <input
        //                     name="firstName"
        //                     type="text"
        //                     {...register('firstName')}
        //                     className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
        //                         errors.firstName ? 'ring-2 ring-red-500' : ''
        //                     }`}
        //                 />
        //                 {errors.firstName && (
        //                     <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
        //                 )}
        //             </div>
        //             <div>
        //                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
        //                     Last Name
        //                 </label>
        //                 <input
        //                     name="lastName"
        //                     type="text"
        //                     {...register('lastName')}
        //                     className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
        //                         errors.lastName ? 'ring-2 ring-red-500' : ''
        //                     }`}
        //                 />
        //                 {errors.lastName && (
        //                     <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        //                 )}
        //             </div>
        //             <div>
        //                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
        //                     Username
        //                 </label>
        //                 <input
        //                     name="username"
        //                     type="text"
        //                     {...register('username')}
        //                     className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
        //                         errors.username ? 'ring-2 ring-red-500' : ''
        //                     }`}
        //                 />
        //                 {errors.username && (
        //                     <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        //                 )}
        //             </div>
        //             <div>
        //                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        //                     Email
        //                 </label>
        //                 <input
        //                     name="email"
        //                     type="email"
        //                     {...register('email')}
        //                     className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
        //                         errors.email ? 'ring-2 ring-red-500' : ''
        //                     }`}
        //                 />
        //                 {errors.email && (
        //                     <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        //                 )}
        //             </div>
        //             <div>
        //                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
        //                     Password
        //                 </label>
        //                 <input
        //                     name="password"
        //                     type="password"
        //                     {...register('password')}
        //                     className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
        //                         errors.password ? 'ring-2 ring-red-500' : ''
        //                     }`}
        //                 />
        //                 {errors.password && (
        //                     <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        //                 )}
        //             </div>
        //             <div>
        //                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
        //                     Confirm Password
        //                 </label>
        //                 <input
        //                     name="confirmPassword"
        //                     type="password"
        //                     {...register('confirmPassword')}
        //                     className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
        //                         errors.confirmPassword ? 'ring-2 ring-red-500' : ''
        //                     }`}
        //                 />
        //                 {errors.confirmPassword && (
        //                     <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
        //                 )}
        //             </div>
        //             <button
        //                 type="submit"
        //                 disabled={isSubmitting}
        //                 className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 text-white font-medium rounded-lg"
        //             >
        //                 {isSubmitting ? (
        //                     <span className="spinner-border spinner-border-sm mr-1"></span>
        //                 ) : (
        //                     'Register'
        //                 )}
        //             </button>
        //             {authError && (
        //                 <div className="text-red-500 text-sm mt-3">{authError.message}</div>
        //             )}
        //         </form>
        //     </div>
        // </div>
    );
}




// import React, {useState,useEffect} from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';
// import { useSelector, useDispatch } from 'react-redux';

// import { history } from '_helpers';
// import { authActions } from '_store';

// const Register = () => {
//     const dispatch = useDispatch();
//     const authUser = useSelector(x => x.auth.user);
//     const authError = useSelector(x => x.auth.error);

//     useEffect(() => {
//         // redirect to home if already logged in
//         if (authUser) history.navigate('/');
//     }, []);

//     // form validation rules
//     const validationSchema = Yup.object().shape({
//         firstName: Yup.string().required('First Name is required'),
//         lastName: Yup.string().required('Last Name is required'),
//         username: Yup.string().required('Username is required'),
//         email: Yup.string().email('Email is invalid').required('Email is required'),
//         password: Yup.string().required('Password is required')
//     });

//     const formOptions = { resolver: yupResolver(validationSchema) };

//     // get functions to build form with useForm() hook
//     const { register, handleSubmit, formState } = useForm(formOptions);
//     const { errors, isSubmitting } = formState;

//     function onSubmit(user) {
//         return dispatch(authActions.register(user))
//     }


//     return (<>
//         <section class="bg-gray-50 dark:bg-gray-900">
//             <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//                 <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
//                     <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
//                     Flowbite    
//                 </a>
//                 <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//                     <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
//                         <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//                             Create and account
//                         </h1>
//                         <form class="space-y-4 md:space-y-6" action="#">
//                             <div>
//                                 <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
//                                 <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
//                             </div>
//                             <div>
//                                 <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
//                                 <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
//                             </div>
//                             <div>
//                                 <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
//                                 <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
//                             </div>
//                             <div class="flex items-start">
//                                 <div class="flex items-center h-5">
//                                     <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
//                                 </div>
//                                 <div class="ml-3 text-sm">
//                                     <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
//                                 </div>
//                             </div>
//                             <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
//                             <p class="text-sm font-light text-gray-500 dark:text-gray-400">
//                                 Already have an account? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
//                             </p>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     </>)
// }

// export default Register;