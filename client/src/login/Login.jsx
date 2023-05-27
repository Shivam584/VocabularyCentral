import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '_helpers';
import { authActions } from '_store';

export { Login };

function Login() {
    const dispatch = useDispatch();
    const authUser = useSelector((x) => x.auth.user);
    const authError = useSelector((x) => x.auth.error);

    useEffect(() => {
        // redirect to home if already logged in
        if (authUser) history.navigate('/');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // form validation rules
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    function onSubmit({ username, password }) {
        return dispatch(authActions.login({ username, password }));
    }

    return (
        <div className="flex items-center justify-center p-40">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border-2 p-6">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Sign-in</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
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
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                className={`w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 ${
                                    errors.password ? 'ring-2 ring-red-500' : ''
                                }`}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 12l2-2m0 0l2-2m-2 2l2 2m-2-2l2 2M16 4l4 4-4 4M8 20l-4-4 4-4"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <div className="text-sm">
                            <a href="/forgot-password" className="text-primary-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="text-sm">
                            <p>
                                Don't have an account?{' '}
                                <a href="/signup" className="text-primary-600 hover:underline">
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>
                    <button
                        disabled={isSubmitting}
                        className="w-full py-2 px-4 mt-6 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 text-white font-medium rounded-lg"
                    >
                        {isSubmitting ? (
                            <span className="spinner-border spinner-border-sm mr-1"></span>
                        ) : (
                            'Login'
                        )}
                    </button>
                    {authError && (
                        <div className="text-red-500 text-sm mt-3">{authError.message}</div>
                    )}
                </form>
            </div>
        </div>
    );
}
