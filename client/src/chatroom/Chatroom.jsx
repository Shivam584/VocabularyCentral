import ChatroomService from '_services/chatroom.service';
import React, { useState, useEffect } from 'react';
import moment from "moment";
import { useSelector } from 'react-redux';
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import "@ai4bharat/indic-transliterate/dist/index.css";

export function ChatRoom() {
  const [currLanguage, setCurrLanguage] = useState('hi')
  const [lastChatId, setLastChatId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroup, setNewGroup] = useState('');
  const [newGroupLanguage, setNewGroupLanguage] = useState('')
  const [languages, setLanguages] = useState([
    { value: "hi", name: 'Hindi' },
    { value: "te", name: 'Telugu' },
    { value: "bn", name: 'Bengali' },
  ])
  // const [messages, setMessages] = useState([]);
  // const [lastChatId, setLastChatId] = useState(null)
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [groupAction, setGroupAction] = useState(true)
  const [groupMessages, setGroupMessages] = useState([]);
  const [text, setText] = useState("")

  const user = useSelector(state => state.auth);

  const handleJoinGroup = async (group) => {
    // setSelectedGroup(group);
    const response = await ChatroomService.groupCreate(newGroup)
    console.log(response.data)
    setSelectedGroup(response.data.group_id)
    const chatResponse = await ChatroomService.groupGetChat(newGroup, newGroupLanguage)
    console.log(chatResponse.data)
    setGroupMessages(chatResponse.data)
    setGroupAction(false)
  };

  const handleSendMessage = () => {
    // if (newMessage.trim() === '') {
    //   return;
    // }

    
  
    const newMessageObj = {
      userId : user.id,
      groupId: selectedGroup,
      content: text,
    };
    
    const updatedGroupMessages = [...groupMessages, newMessageObj];
    setGroupMessages(updatedGroupMessages);
    setNewMessage('');
    setText('')
  };
   
  const toggleGroupAction = () => {
    if(selectedGroup!==null)
        setGroupAction(!groupAction)
  }

  useEffect(() => {
    if(selectedGroup){
      const fetchData = async () => {
        try {
          const response = await ChatroomService.groupGetChat(newGroup, newGroupLanguage, lastChatId);
          console.log(response.data);
          if (response.data.length > 0) {
            setLastChatId(response.data[response.data.length - 1].id);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      // Fetch data initially
      fetchData();
  
      // Set up an interval to fetch data every 15 seconds
      const interval = setInterval(fetchData, 1500000);
  
      // Clean up the interval when the component unmounts
      return () => clearInterval(interval);
    }
  }, []);

  const renderGroupList = () => (
    <div className="w-1/6 bg-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Available Groups</h2>
      {/* button to create new group */}
        {/* <div className="flex mb-4">
            {
                selectedGroup?(
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={toggleGroupAction}
                    >
                        {
                            !groupAction ? 'Create / Join Group' : 'Back to Chat'
                        }
                    </button>
                ):(
                    <></>
                )
            }
        </div> */}
      <ul>
        {groups.map((group) => (
          <li
            key={group.id}
            className={`cursor-pointer p-2 ${
              selectedGroup && selectedGroup.id === group.id ? 'bg-gray-400' : ''
            }`}
            // onClick={
            //     ()=>{
            //         handleJoinGroup(group)
            //         if(groupAction)
            //             toggleGroupAction()
            //     }
            // }
          >
            {group.groupname}
          </li>
        ))}
      </ul>
    </div>
  );

  const RenderChatBox = () => {
   
  
    return (
      <div className="flex flex-col flex-grow bg-gray-100">
        <div className="flex-grow overflow-y-auto p-4">
        <div className="flex items-center bg-gray-200 p-2 sticky bottom-0">
          {/* <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 mr-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white"
          /> */}
          <IndicTransliterate
            className="flex-grow px-4 py-2 mr-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white"
            value={text}
            onChangeText={(text) => {
              setText(text);
            }}
            lang={newGroupLanguage}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
          {groupMessages.map((message) => (
            <div
              key={message.id}
              className={`rounded-md p-2 mb-2 ${
                message.username === user.username ? 'bg-blue-100' : 'bg-gray-200'
              }`}
            >
              <div className="font-semibold mb-1">{message.username}{" "}{
                // moment js time from the timestamp till now
                moment(message.timestamp).fromNow()
              }</div>

              <div>{message.content}</div>
            </div>
          ))}
          {/* Add an empty div at the end to provide space for sticky chat entry */}
          <div style={{ height: '100px' }}></div>
        </div>
        
      </div>
    );
  };
  
  

  useEffect( () => {
    try{
      const getAllPromises = async () => {
        const response  = await ChatroomService.groupFetchList() 
        console.log(response)
        setGroups(response)
        setSelectedGroup(null)
      }
      
      getAllPromises()

      setLoading(false)
    }catch{
      console.log("error")
    }

  }, [])

  return (
    <>{
        loading ? (<>
            {/* flowbite loader */}
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
            </div>
        </>):(<>
            <div className="flex flex-col h-screen">
                <div className="flex flex-grow">
                    {groups.length > 0 && renderGroupList()}
                    <div className={`flex-grow ${groups.length === 0 ? 'bg-gray-100' : ''} flex flex-col`}>
                    {groupAction || selectedGroup === null ? (
                        <div className="flex flex-col items-center justify-center flex-grow">
                        <h2 className="text-xl font-semibold mb-4">Create / Join a Group</h2>
                        <input
                            type="text"
                            value={newGroup}
                            onChange={(e) => setNewGroup(e.target.value)}
                            placeholder="Enter group name"
                            className="w-1/2 px-4 py-2 mb-4 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white"
                        />
                        {/* Create a list of languages here using a select input tag*/}
                        <select
                            className="w-1/2 px-4 py-2 mb-4 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white"
                            value={newGroupLanguage}
                            onChange={(e) => setNewGroupLanguage(e.target.value)}
                        >
                            <option value="">Select a language</option>
                            {languages.map((language) => (
                            <option key={language.value} value={language.value}>
                                {language.name}
                            </option>
                            ))}
                        </select>

                        <div className="flex">
                            <button
                            // onClick={() => setSelectedGroup(groups[0])}
                            onClick={()=>{handleJoinGroup()}}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                            >
                            Join Group
                            </button>
                        </div>
                        </div>
                    ) : (
                        <div className="flex flex-col flex-grow">{RenderChatBox()}</div>
                    )}
                    </div>
                </div>
            </div>
        </>)
    }</>
  );
}
