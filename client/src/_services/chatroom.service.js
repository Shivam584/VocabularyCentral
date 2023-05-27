import axios from "axios";

const API_URL = "http://127.0.0.1:8000/chatroom/";

const groupFetchList = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }
    const response = await axios.get(API_URL + "group/list/", {headers: headers});
    return response.data;
}

const  groupCreate = async (groupName) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
    }
    const response = await axios.post(
        API_URL + "join/",{
            groupname: groupName
        },
        {
            headers
        }
    )
    return response;
}

const groupGetChat = async (groupName, language, last_chat_id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    };
  
    console.log(API_URL + `get/${groupName}/${language}/`);
  
    const response = await axios.get(API_URL + `get/${groupName}/${language}/`, {
      headers: headers,
      params: {
        last_chat_id: last_chat_id
      }
    });
  
    return response;
  };
  

const groupPostChat = async(user_id, group_id, message) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
    }
    const response = await axios.post(API_URL + "post/", {
        "user": user_id,
        "group": group_id,
        "content": message
    }, {headers: headers});
    return response.data;
}

const ChatroomService = {
    groupFetchList,
    groupCreate,
    groupGetChat,
    groupPostChat
}

export default ChatroomService;