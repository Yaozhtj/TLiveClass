import io from 'socket.io-client'; //used to backend to front end
import { useState } from 'react';
import Class from './components/Class'

const socket = io.connect("http://localhost:3001")
//const socket = io.connect("https://kyledeguzman-chitchat.herokuapp.com/");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }
  return (
    <div className="App">
      {/* {!showChat ?
        (<section className='join-class'>
          <h3>TLiveClass</h3>
          <input type="text" placeholder="输入学号姓名" onChange={(event) => { setUsername(event.target.value); }}></input>
          <input type="text" placeholder="输入课程名" onChange={(event) => { setRoom(event.target.value.toLowerCase()); }}></input>
          <button onClick={joinRoom}>加入课堂</button>
        </section>)
        :
        (<Class socket={socket} username={username} room={room} />)
      } */}
      <Class socket={socket} username={"1952731"} room={"multimedia"}></Class>
    </div>
  );
}

export default App;
