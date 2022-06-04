import React, { useState, useEffect, useRef } from 'react';
import flvjs from 'flv.js';
import Danmaku from 'rc-danmaku';
var flvPlayer;

function Class({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const danmakuInsRef = useRef(Danmaku);

  const getTimeString = (date) => {
    let hours = date.getHours().toString();
    if (hours.length < 2) {
      hours = "0" + hours;
    }
    let minutes = date.getMinutes().toString();
    if (hours.length < 2) {
      hours = "0" + minutes;
    }
    let seconds = date.getSeconds().toString();
    if (seconds.length < 2) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  }
  const [messageList, setMessageList] = useState([{
    room: "a",
    author: "1952730",
    message: "欢迎来到TLiveClass",
    time: getTimeString(new Date(Date.now()))
  }, {
    room: "a",
    author: "00010",
    message: "这是一条测试信息",
    time: getTimeString(new Date(Date.now()))
  }, {
    room: "a",
    author: "上善若水",
    message: "老师好！",
    time: getTimeString(new Date(Date.now()))
  }, {
    room: "a",
    author: "幸福一生",
    message: "早上好",
    time: getTimeString(new Date(Date.now()))
  }, {
    room: "a",
    author: "上水",
    message: "你好哈哈哈哈哈 你好啊",
    time: getTimeString(new Date(Date.now()))
  }, {
    room: "a",
    author: "上善若水",
    message: "你好我好哈哈 你好啊",
    time: getTimeString(new Date(Date.now()))
  }]);

  const SendMessage = async () => {
    if (currentMessage !== "") {
      if (danmakuInsRef.current) {
        danmakuInsRef.current.push(currentMessage);
      }
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: getTimeString(new Date(Date.now()))
      }
      setMessageList((list) => [...list, messageData]);
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList((list) => [...list, data]);
      if (danmakuInsRef.current) {
        danmakuInsRef.current.push(data.message);
      }
    })
  }, [socket]);
  // 移动滚动条到底部
  useEffect(() => {
    let chatBody = document.getElementById('chat-body');
    console.log(chatBody);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, [messageList]);

  useEffect(() => {
    const danmakuIns = new Danmaku('.live-container');
    danmakuInsRef.current = danmakuIns;
  }, [])

  // useEffect(() => {
  //   flvPlayer = flvjs.createPlayer({
  //     type: 'flv',
  //     isLive: false,
  //     enableWorker: true,
  //     enableStashBuffer: false,
  //     stashInitialSize: 128,
  //     url: 'http://127.0.0.1:8080/live?app=live&stream=yzh'
  //   });
  //   flvPlayer.attachMediaElement(document.getElementById('class-live'));
  //   flvPlayer.load();
  //   flvPlayer.play();
  // },[])

  return (
    <div className="class">
      <div className='class-live'>
        <div className='live-body'>
          <div className="live-container">
            <video className='video' controls width="100%" id='class-live' src={require('../assets/TopThink_01.mp4')} autoPlay muted>
            </video>
            {/* <video className='video' controls width="100%" id='class-live' autoPlay muted>
          </video> */}
          </div>
          <div className='room-name'>
            <p>
              {"直播课程：" + room}
            </p>
          </div>
        </div>
      </div>
      <div className='class-chat'>
        <div className="chat-container">
          <div className="chat-body" id='chat-body'>
            {
              messageList.map((messageContent) => {
                if (messageContent.author === username) {
                  return (
                    <div className="chat-element chat-right">
                      <div className="chat-name">{messageContent.author.charAt(0).toUpperCase() + messageContent.author.slice(1)}</div>
                      <div className="chat-box">
                        {messageContent.message}
                      </div>
                      <div className="chat-time">{messageContent.time}</div>
                    </div>
                  )
                } else {
                  return (
                    <div className="chat-element chat-left">
                      <div className="chat-name">{messageContent.author.charAt(0).toUpperCase() + messageContent.author.slice(1)}</div>
                      <div className="chat-box">
                        {messageContent.message}
                      </div>
                      <div className="chat-time">{messageContent.time}</div>
                    </div>
                  )
                }
              })
            }
          </div>
          <div className="chat-sender">
            <input type="text" placeholder="输入消息" value={currentMessage} onChange={(event) => { setCurrentMessage(event.target.value) }}></input>
            <button onClick={SendMessage} >发送</button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Class;