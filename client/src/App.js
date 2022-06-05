import io from 'socket.io-client';
import { useState } from 'react';
import Classroom from './components/Classroom'
import React from 'react';
const socket = io.connect("http://localhost:3001")


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showClass, setShowClass] = useState(false);



  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowClass(true);
    }
  }
  return (
    <div className="App">
      {/* {!showClass ?
        (<section className='join-class'>
          <h3>TLiveClass</h3>
          <input type="text" placeholder="输入学号姓名" onChange={(event) => { setUsername(event.target.value); }}></input>
          <input type="text" placeholder="输入课程名" onChange={(event) => { setRoom(event.target.value.toLowerCase()); }}></input>
          <button onClick={joinRoom}>加入课堂</button>
        </section>)
        :
        (<Classroom socket={socket} username={username} room={room} />)
      } */}
      <Classroom socket={socket} username={"1952731"} room={"yzh"}/>
    </div>
  );
}

export default App;
