import React, { useState, useEffect } from 'react';
import BulletScreen from 'rc-bullets';
import flvjs from 'flv.js';
var flvPlayer = null
var screen = null
function Classroom({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  // 弹幕屏幕
  const [hide, setHide] = useState(false);
  const [pause, setPause] = useState(false);

  // 将时间格式化为字符串
  const getTimeString = (date) => {
    let hours = date.getHours().toString();
    if (hours.length < 2) {
      hours = "0" + hours;
    }
    let minutes = date.getMinutes().toString();
    if (minutes.length < 2) {
      minutes = "0" + minutes;
    }
    let seconds = date.getSeconds().toString();
    if (seconds.length < 2) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  }

  // 初始化聊天室信息
  const [messageList, setMessageList] = useState([{
    room: "",
    author: "课堂小助手",
    message: "欢迎来到TLiveClass",
    time: getTimeString(new Date(Date.now()))
  }, {
    room: "",
    author: "课堂小助手",
    message: "请遵守课堂规则～",
    time: getTimeString(new Date(Date.now()))
  }]);
  // 初始化flv播放器
  useEffect(() => {
    flvPlayer = flvjs.createPlayer({
      type: 'flv',
      isLive: false,
      enableWorker: true,
      enableStashBuffer: false,
      stashInitialSize: 128,
      url: `http://127.0.0.1:8080/live?app=live&stream=${room}`
    });
    flvPlayer.attachMediaElement(document.getElementById('class-live'));
    flvPlayer.load();
    flvPlayer.play()

    screen = new BulletScreen('.live-container', { duration: 15 });
  }, []);
  // 初始化弹幕，给页面中某个元素初始化弹幕屏幕
  // 添加弹幕
  const pushBullet = (message) => {
    screen.push(<div className='live-bullet'>{message} </div>);
  }
  // 发送信息
  const SendMessage = async () => {
    if (currentMessage !== "") {
      pushBullet(currentMessage);
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
  // 接收信息
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // 加弹幕
      pushBullet(data.message);
      console.log(data);
      // 更新聊天框
      setMessageList((list) => [...list, data]);
    })
  }, [socket]);
  // 接收到信息移动滚动条到底部
  useEffect(() => {
    let chatBody = document.getElementById('chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
  }, [messageList]);

  return (
    <div className="class">
      <div className='class-live'>
        <div className='live-body'>
          <div className="live-container">
            {/* <video className='video' controls width="100%" id='class-live'
              src={require('../assets/TopThink_01.mp4')} autoPlay muted>
            </video> */}
            <video className='video' controls width="100%" id='class-live' autoPlay muted>
            </video>
          </div>
          <div className='room-name'>
            <p>
              {"🎓直播课程：" + room}
            </p>
            <button className='control-button' onClick={() => {
              if (flvPlayer != null) {
                flvPlayer.unload();
                flvPlayer.detachMediaElement();
                flvPlayer.destroy();
                flvPlayer = null;
              }
              flvPlayer = flvjs.createPlayer({
                type: 'flv',
                isLive: false,
                enableWorker: true,
                enableStashBuffer: false,
                stashInitialSize: 128,
                url: `http://127.0.0.1:8080/live?app=live&stream=${room}`
              });
              flvPlayer.attachMediaElement(document.getElementById('class-live'));
              flvPlayer.load();
              flvPlayer.play();
            }}>{"刷新"}</button>
            <button className='control-button' onClick={() => {
              if (pause) {
                screen.resume();
                setPause(false);
              } else {
                screen.pause();
                setPause(true);
              }
            }}>{pause ? "⏸播放弹幕" : "⏹暂停弹幕"}</button>
            <button className='control-button' onClick={() => {
              if (hide) {
                screen.show();
                setHide(false);
              } else {
                screen.hide();
                setHide(true);
              }
            }}> {hide ? "✅打开弹幕" : "🚫关闭弹幕"}</button>
          </div>
        </div>
      </div>
      <div className='class-chat'>
        <div className="chat-container">
          <div className="chat-body" id='chat-body'>
            <div className="chat-welcome">-欢迎来到直播课堂🎓：{room}-</div>
            {messageList.map((messageContent) => {
              if (messageContent.author === username) {
                return (
                  <div className="chat-element chat-right">
                    <div className="chat-name">{messageContent.author.charAt(0).toUpperCase() + messageContent.author.slice(1) + "🧒"}</div>
                    <div className="chat-box">
                      {messageContent.message}
                    </div>
                    <div className="chat-time">{messageContent.time}</div>
                  </div>
                )
              } else {
                return (
                  <div className="chat-element chat-left">
                    <div className="chat-name">{"🧑🏻" + messageContent.author.charAt(0).toUpperCase() + messageContent.author.slice(1)}</div>
                    <div className="chat-box">
                      {messageContent.message}
                    </div>
                    <div className="chat-time">{messageContent.time}</div>
                  </div>
                )
              }
            })}
          </div>
          <div className="chat-sender">
            <input type="text" placeholder="输入消息" onKeyDown={(event) => {
              if (event.key === 'Enter') {
                SendMessage();
              }
            }} value={currentMessage} onChange={(event) => { setCurrentMessage(event.target.value) }}></input>
            <button onClick={SendMessage}>发送</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Classroom;