import * as React from 'react';
import { io } from 'socket.io-client';
import LoadingButton from 'components/buttons/LoadingButton';

// Electron Inter Process Communication and dialog
const { ipcRenderer } = window.require('electron');

// Dynamically generated TCP (open) port between 3000-3999
const port = ipcRenderer.sendSync('get-port-number');

export default function TestSocketCount() {
  const [connected, setConnected] = React.useState(false);
  const [count1, setCount1] = React.useState(0);
  const [count2, setCount2] = React.useState(0);

  React.useEffect(() => {
    if (connected === false) {
      const socket = io(`http://localhost:${port}`, {
        transports: ['websocket'],
        cors: {
          origin: `http://localhost:${port}`,
        },
      });

      socket.on('connect', (data) => {
        console.log('connected');
        console.log(data);
        setConnected(true);
      });

      socket.on('disconnect', (data) => {
        console.log('disconnected');
        console.log(data);
      });

      socket.on('test-message', (data) => {
        console.log(data);
        setCount2(data['count']);
      });

      return function cleanup() {
        console.log('disconnecting socket');
        socket.disconnect();
      };
    }
  }, []);

  // React.useEffect(() => {
  //   console.log('socket id: ' + socket.id);
  //   console.log('socket connected: ' + socket.connected);
  // }, [connected]);

  return (
    <div>
      <LoadingButton setCount1={setCount1} setCount2={setCount2} />
      <p>Print count: {count1}</p>
      <p>Emit count: {count2}</p>
    </div>
  );
}
