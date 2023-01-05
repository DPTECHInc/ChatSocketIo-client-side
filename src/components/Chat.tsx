
import { useState, useEffect } from 'react'
import { io } from "socket.io-client"

const url = "https://bocal-academy-chat.osc-fr1.scalingo.io/"
const socket = (io(url, { autoConnect: false }))
// const socket = io(url, { autoConnect: false })

function Chat(): JSX.Element {

    /** useState */
    const [newMessage, setNewMessage] = useState<string>("")
    const [data, setNewData] = useState([])
    // const [socket, setSocket] = useState<string | null>(null)

    /** Init Login at first render */
    useEffect(() => {
        console.log("Connexion");
        const newSocket =
            socket.auth = {
                userName: "Barbu_san",
                password: "cacahuete"
            }
        socket.connect()
    }, [])

    /** Update Message List */
    useEffect(() => {
        getMessage()
    }, [data])

    /** Input Handler  */
    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const EnteredInput = e.target.value
        setNewMessage(EnteredInput)
    }

    /** Send Message to Socket */
    const sendMessage = (e: React.ChangeEvent<HTMLFormElement>) => {
        socket.emit("message", { content: newMessage })
        setNewMessage("")
        e.preventDefault()
    }

    /** Get Messages From Socket */
    const getMessage = () => {
        socket.on("message", (data) => {
            console.log("New Message from" + data.username);
            [...data, setNewData(data.content)]
        })
    }
    /** Main Render */
    return (
        <div className="App">
            <div className="chatBox">
                <form onSubmit={sendMessage}>
                    <input value={newMessage} placeholder="put message to send " type="text" onChange={inputHandler} />
                    <button type="submit">Send</button>
                </form>
            </div>
            <div className="chatField">
                <ul>
                    {data.map((message, index) =>
                        <li key={index}>{message}</li>)}
                </ul>
            </div>

        </div>
    )
}

export default Chat
