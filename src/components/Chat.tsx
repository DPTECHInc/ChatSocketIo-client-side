import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { io } from "socket.io-client"

const socket = io("https://bocal-academy-chat.osc-fr1.scalingo.io/", { autoConnect: false });

function Chat(): JSX.Element {
    const [newMessage, setNewMessage] = useState<string>("");
    const [data, setNewData] = useState<string[]>([]);
    const socketRef = useRef(socket);

    useEffect(() => {
        console.log("Connexion");
        socket.on("authentication", (data) => {
            socket.emit("authenticate", {
                userName: "Barbu_san",
                password: "cacahuete"
            });
        });
        socket.connect();
    }, []);

    useEffect(() => {
        socket.on("message", (data) => {
            console.log("New Message from" + data.username);
            setNewData([...data, data.content]);
        });
    }, []);

    useEffect(() => {
        console.log("Update Message List");
    }, [data]);

    useEffect(() => {
        if (newMessage) {
            socketRef.current.emit("message", { content: newMessage });
        }
    }, [newMessage]);

    const inputHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const EnteredInput = e.target.value;
        setNewMessage(EnteredInput);
    }, []);

    const sendMessage = (e: React.ChangeEvent<HTMLFormElement>) => {
        setNewMessage("");
        e.preventDefault();
    };

    const messages = useMemo(() => data.map((message, index) => (
        <li key={index}>{message}</li>
    )), [data]);

    return (
        <div className="App">
            <div className="chatBox">
                <form onSubmit={sendMessage}>
                    <input value={newMessage} placeholder="Enter Message" type="text" onChange={inputHandler} />
                    <button type="submit">Send</button>
                </form>
                <ul className="messageField">{messages}</ul>
            </div>
        </div>
    )
}
export default Chat