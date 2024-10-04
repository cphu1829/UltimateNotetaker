'use client'
import React, { useState } from 'react';
import './globals.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AiFillHome, AiOutlinePlus } from 'react-icons/ai';  // Import icons
import { Box, Button, Stack, TextField, TextareaAutosize } from '@mui/material'
import { useRef, useEffect } from 'react'


function App() {
  const [sections, setSections] = useState([{ name: 'Default', notes: [] }]);
  const [activeSection, setActiveSection] = useState(0);
  const [newSectionName, setNewSectionName] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello, I am your personal notetaker, how can I help you?`,
    },
  ])
  const [message, setMessage] = useState('')
  // const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
    // setIsLoading(true)

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    // setIsLoading(false)
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      setSections([...sections, { name: newSectionName, notes: [] }]);
      setNewSectionName('');
    }
  };

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
    <div className="App">
      <div className="sidebar">
        <div className="logo">
          <AiFillHome size="1.5em" />  {/* Home icon */}
          <h1>NoteApp</h1>
        </div>
        <div className="section-list">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`section-item ${index === activeSection ? 'active' : ''}`}
              onClick={() => setActiveSection(index)}
            >
              {section.name}
            </div>
          ))}
        </div>
        <div className="new-section">
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="New Section"
          />
          <button onClick={handleAddSection}><AiOutlinePlus size="1.2em" /></button>  {/* Plus icon */}
        </div>
      </div>

      <div className="main">
        <div className="note-editor">
          <TextareaAutosize
            label="Message"
            className='textarea'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minRows={40}
          />
          <Button 
            variant="contained" 
            onClick={sendMessage}
            className='send'>
            Send
          </Button>
        </div>
        <div className="note-editor">

          {/* Chatbot Content */}
          <Stack
            direction={'column'}
            width="90%"
            maxWidth="90%"
            height="calc(100vh - 100px)"
            border="1px solid black"
            p={2}
            spacing={3}
            sx={{
              overflow: "hidden", mx: "auto",
            }} 
          >
            <Stack
              direction={'column'}
              spacing={2}
              flexGrow={1}
              overflow="auto"
              sx={{ maxHeight: '100%' }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === 'assistant' ? 'flex-start' : 'flex-end'
                  }
                >
                  <Box
                    bgcolor={
                      message.role === 'assistant'
                        ? 'primary.main'
                        : 'secondary.main'
                    }
                    color="white"
                    borderRadius={6}
                    p={2}
                    maxWidth="90%"
                    sx={{ wordBreak: 'break-word'}}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
          </Stack>
        </div>
      </div>
    </div>
  );
}

export default App;