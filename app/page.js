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
    const popupRef = useRef(null);
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

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState('HELLLO');
    const [popupPosition, setPopupPosition] = useState({ top: 1000, left: 1000 });
    var cursorPosition = [0,0];

    const handleMouseUp = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText) {
            console.log("handleMouseUP")
            // console.log("Cursor end pos:", textarea, cursorPosition)
            
            // Get the start and end container nodes
            
            // const startContainer = range.startContainer;
            // const endContainer = range.endContainer;
            // const startOffset = range.startOffset;
            // const endOffset = range.endOffset;
            
            // Get the start and end offsets within the container nodes
            const range = selection.getRangeAt(0).getBoundingClientRect();
            const { top, left, width, height } = range;

            console.log("top: original vs new", window.scrollY + top + height + 10,  height + cursorPosition[1])
            var relativeXpos = cursorPosition[0]
            if (event.clientX < cursorPosition[0]) {
                relativeXpos = event.clientX
            }

            setPopupContent(`"${selectedText}"`);
            setPopupPosition({
                // top: window.scrollY + top + height + 10, // Position 10px below the selection
                // left: window.scrollX + left, // Align popup with the left of the selection

                top: height + cursorPosition[1],
                left: relativeXpos
            });
        //   console.log("top, left", top, left)
            setPopupVisible(true);
        } else {
            setPopupVisible(false);
        }
    };


    const handleMouseDown = () => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            setPopupVisible(false); // Close the popup if clicked outside
        }
        const textarea = document.getElementById("myEditableDiv");
        cursorPosition = [event.clientX, event.clientY];
        console.log("Cursor start pos:", cursorPosition);
    };

    // useEffect(() => {
    //     const button = document.getElementById("Define Button");
    //     button.addEventListener("click", console.log("1231231"));
    
    //     return () => {
    //         button.removeEventListener("click", handleClick); // Cleanup
    //     };
    // }, []);
    const popupSendMessage = async (type) => {
        console.log("popupSendMessage")
        console.log("this is popupContent: ", popupContent)
        setPopupVisible(false)
        if (popupContent.trim()) { // Don't send empty messages
            setIsDisabled(true);

            console.log("is being disabled now")

            prompt = ""
            if (type == "Define") {
                prompt = "Define: "
            }
            else if (type == "Explain") {
                prompt = "Explain this in simpler terms: "
            }
            else if (type == "Solve") {
                // send to WOLFRAM ALPHA

                //this is a placeholder for now
                prompt = "Solve this equation: "
            }
            sendMessage(prompt + popupContent, messages, setMessages);
            console.log(messages)

            setTimeout(() => {
                setIsDisabled(false);
            }, 3);
        };
    }

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousedown', handleMouseDown); // To close the popup if clicking outside

        // Cleanup event listeners when the component unmounts
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

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

            <Box className="main"
            // onMouseUp={handleMouseUp}
            // onMouseDown={handleMouseDown}
            >
                <Box className="note-editor">
                    <TextareaAutosize
                        id = "myEditableDiv"
                        label="Message"
                        className='textarea'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        minRows={40}
                    />
                     {popupVisible && (
                        <Stack
                            alignItems={'stretch'}
                            spacing={1}
                            style={{
                                position: 'absolute',
                                top: `${popupPosition.top}px`,
                                left: `${popupPosition.left}px`,
                            }}
                        >
                            {/* <Box
                            style={{
                                backgroundColor: '#f1f1f1',
                                border: '1px solid #ccc',
                                padding: '10px',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                zIndex: 1000,
                            }}
                            >{popupContent}</Box> */}
                            <Button
                                id = "Define Button"
                                // onClick={sendMessage("explain" + popupContent, messages, setMessages)}
                                // disabled={!popupVisible}
                                onClick={() => popupSendMessage("Define")}
                            >
                                Define
                            </Button>
                            <Button
                                onClick={() => popupSendMessage("Explain")}
                            >
                                Explain
                            </Button>
                            <Button
                                onClick={() => popupSendMessage("Solve")}
                            >
                                Solve
                            </Button>

                        
                        </Stack>
                    )}

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