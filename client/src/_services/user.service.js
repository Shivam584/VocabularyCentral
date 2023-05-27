import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/user/";

const register = ({ firstName, lastName, username, email, password, confirmPassword }) => {
    return axios.post(API_URL + "register/", {
        firstName : firstName,
        lastName : lastName,
        username : username,
        email : email,
        password : password,
        password2 : confirmPassword
    });
}

const login = async (username, password) => {
    const response = await axios.post(API_URL + "login/", {
        username,
        password
    });
    if (response.data.token) {
        console.log(response.data)
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${response.data.token.access}`,
          }
        const profile = await axios.get(
            API_URL + "profile/",
            {
                headers
            }
        )
        console.log(profile.data)
        localStorage.setItem("user", JSON.stringify(profile.data));
        return {
            ...profile.data,
            token: response.data.token.access
        }
    }
    return response.data;
}

const logout = () => {
    localStorage.removeItem("user");
}

const getProfile = () => {
    return JSON.parse(localStorage.getItem("user"));
}

const changePassword = (newPassword) => {
    return axios.post(API_URL + "changePassword", {
        newPassword
    });
}

const sendMailForVerification = (username, email) => {
    return axios.post(API_URL + "mail/verify/", {
        username,
        email
    });
}

const mailVerification = (uid, uniqueToken) => {
    return axios.post(API_URL + `verify/${uid}/${uniqueToken}/`);
}

const mailPasswordReset = (username, email) => {
    return axios.post(API_URL + "mail/reset/", {
        username,
        email
    });
}

const userSetPasswordViaToken = (newPassword, uid, token) => {
    return axios.post(API_URL + `reset/${uid}/${token}/`, {
        newPassword
    });
}



// export the above
const UserService = {
    register,
    login,
    logout,
    getProfile,
    changePassword,
    sendMailForVerification,
    mailVerification,
    mailPasswordReset,
    userSetPasswordViaToken
}

export default UserService;