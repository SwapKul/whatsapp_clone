import { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';

function App() {
  
  const [ messages, setMessages ] = useState([]);

  useEffect(() => {
    axios.get('/messages/sync')
      .then( res => {
          setMessages(res.data);
        }
      )
  }, [])

  useEffect(() => {
    const pusher = new Pusher('9c63da0144bd14c91c48', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage]);
    });
    
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

  }, [messages])

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar/>
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
