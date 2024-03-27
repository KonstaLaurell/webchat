import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; // Import jwt_decode
import axios from "axios";
import './Chat.css'; // Import the CSS file
import ChatMessage from './ChatMessage'; // Import the ChatMessage component
import { redirect } from 'react-router-dom';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [userId, setUserId] = useState(null);
    const messagesEndRef = useRef(null);
    const [amount, setAmount] = useState(null);
    const [showShoutBox, setShowShoutBox] = useState(false); // State to control shout box visibility
    const [shoutBoxMessage, setShoutBoxMessage] = useState(''); // State to control shout box message
    const [shoutuser, setShoutuser] = useState(''); // State to control shout box amount
    const token = localStorage.getItem("token");
    useEffect(() => {
        
        if (!token) {
            redirect("/")
            return;
        }

        // Decode the token to get user ID

        const newSocket = io('https://api.tyhjyys.fun/', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: {
                token: token,
            },

        });
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim() === '') return;
        socket.emit('chat message', {message: newMessage, token: token});
        setNewMessage('');
    };

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                console.log('Connected to server');
            });

            socket.on('chat message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.on('chat history', (history) => {
                setMessages(history.reverse());
            });
            socket.on("user amount", (amount)=>{
                setAmount(amount);
            });
            socket.on("shout",(shout)=>{
                setShoutuser(shout.user)
                setShoutBoxMessage(shout.message)
                setShowShoutBox(true)
                setTimeout(() => {
                    setShowShoutBox(false)
                }, 5000);
            });
            socket.emit('get messages');
        }

        return () => {
            if (socket) {
                socket.off('chat message');
                socket.off('chat history');
            }
        };
    }, [socket]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-container">
            {showShoutBox && (
                <div className="shout">
                    <div className="shout-name">{shoutuser}</div>
                    <div className="shout-text">{shoutBoxMessage}</div>
                </div>
            )}
            <div className="chat-header">
                <h1>Chat</h1>
                <h1>Online: {amount}</h1>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
                <input
                    className="chat-input"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button
                    className="chat-button"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </div>

        </div>
    );
};

export default Chat;
