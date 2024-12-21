'use client'
import React, { useState } from 'react';
import './globals.css';
import 'react-quill/dist/quill.snow.css';
import { AiFillHome, AiOutlinePlus } from 'react-icons/ai';  // Import icons
import { Box, Button, Stack, TextField, TextareaAutosize } from '@mui/material'
import { useRef, useEffect } from 'react'
import {sendMessage} from "./message_function"
import styles from './globals.css';
import Typography from '@mui/material/Typography';


function App() {
    const [sections, setSections] = useState([{ name: 'Default', notes: [] }]);
    const [activeSection, setActiveSection] = useState(0);
    const [newSectionName, setNewSectionName] = useState('');
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const [messages, setMessages] = useState('Hello, I am your personal notetaker, how can I help you?')

    //   const [messages, setMessages] = useState([
    //     {
    //       role: 'assistant',
    //       content: `Hello, I am your personal notetaker, how can I help you?`,
    //     },
    //   ])
    const [message, setMessage] = useState('')

    const handleAddSection = () => {
        if (newSectionName.trim()) {
            setSections([...sections, { name: newSectionName, notes: [] }]);
            setNewSectionName('');
            }
        };

    const summarize = async () => {
        if (message.trim()) { // Don't send empty messages
            setIsDisabled(true);

            console.log("is being disables now")

            sendMessage(message, messages, setMessages);
            console.log(messages)

            setTimeout(() => {
                setIsDisabled(false);
            }, 3);
        };
    }

    const handleAddNote = () => {
        if (newNoteTitle.trim()) {
        const updatedSections = [...sections];
        updatedSections[activeSection].notes.push({
            title: newNoteTitle,
            content: newNoteContent,
        });
        setSections(updatedSections);
        setNewNoteTitle('');
        setNewNoteContent('');
        setSelectedNoteIndex(null);
        }
    };

    return (
        <Box className="app">
            <Box className="sidebar">
                <Box className="logo">
                    <AiFillHome size="1.5em" />  {/* Home icon */}
                    <h1>NoteApp</h1>
                </Box>
                <Box className="section-list">
                    {sections.map((section, index) => (
                        <Box
                            key={index}
                            className={`section-item ${index === activeSection ? 'active' : ''}`}
                            onClick={() => setActiveSection(index)}
                            >
                            {section.name}
                        </Box>
                    ))}
                </Box>
                <Box className="new-section">
                    <input
                        type="text"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        placeholder="New Section"
                    />
                    <button onClick={handleAddSection}><AiOutlinePlus size="1.2em" /></button>  {/* Plus icon */}
                </Box>
            </Box>

            <Box className="main">
                <Box className="note-editor">
                    <TextareaAutosize
                        label="Message"
                        className='textarea'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        minRows={40}
                    />
                    <Button 
                        variant="contained" 
                        onClick={summarize}
                        className="send"
                        disabled={isDisabled}>
                        Send
                    </Button>
                </Box>

                <Box className="note-editor">

                    <Box className="postDesc">
                        <Typography
                            variant="body1" // Equivalent to a <p> tag
                            className="ai-output">
                            {messages}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default App;