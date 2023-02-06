import * as React from "react";
import Button from "@mui/material/Button";

export default function WebSocketCall({ socket }) {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  const handleText = (e) => {
    const inputMessage = e.target.value;
    setMessage(inputMessage);
  };

  const handleSubmit = () => {
    if (!message) {
      return;
    }
    console.log("emit message on button click");
    socket.emit("data", message);
    setMessage("");
  };

  React.useEffect(() => {
    socket.on("data", (data) => {
      console.log("on data");
      console.log(data);
      setMessages([...messages, data.data]);
    });
    return () => {
      socket.off("data", () => {
        console.log("off data");
        console.log("data event was removed");
      });
    };
  }, [socket, messages]);

  return (
    <div>
      <h2>WebSocket Communication</h2>
      <input type="text" value={ message } onChange={ handleText } />
      <Button variant="contained" onClick={ handleSubmit }>
        Submit
      </Button>
      <ul>
        {messages.map((msg, index) => (
          <li key={ index }>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
