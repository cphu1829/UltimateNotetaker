
export async function sendMessage(message, messages, setMessages) {

    // setMessages((messages) => [
    //     ...messages,
    //     { role: 'user', content: message },
    //     { role: 'assistant', content: '' },
    // ])
  
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            // body: JSON.stringify([...messages, { role: 'user', content: message }]),
            body: JSON.stringify({ role: 'user', content: message }),
        })
    
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
    
        const reader = response.body.getReader()
        const decoder = new TextDecoder()

    
        // while (true) {
        //     const { done, value } = await reader.read()
        //     if (done) break
        //     const text = decoder.decode(value, { stream: true })
        //     setMessages(text);
        //     // setMessages((messages) => {
        //     //     let lastMessage = messages[messages.length - 1]
        //     //     let otherMessages = messages.slice(0, messages.length - 1)
        //     //     console.log(text)
        //     //     return [
        //     //         ...otherMessages,
        //     //         { ...lastMessage, content: lastMessage.content + text },
        //     //     ]
        //     // })
        // }

        let accumulatedResponse = ''; // To store the accumulated text

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });

            // Accumulate the response
            accumulatedResponse += text;

            // Update the state with the accumulated response
            setMessages(accumulatedResponse);
        }
    } catch (error) {
        console.error('Error:', error)
        setMessages("I'm sorry, but I encountered an error. Please try again later.")
        // setMessages((messages) => [
        //     ...messages,
        //     { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
        // ])
        return;
    }
}