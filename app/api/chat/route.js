import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are to summarize fed notes in a more understandable manner`// Use your own system prompt here

// POST function to handle incoming requests
export async function POST(req){
    const openai = new OpenAI({
        baseURL:"https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    });
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            data, // Directly add the single object
        ],
        model: "openai/gpt-3.5-turbo",
        stream: true,
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0].delta.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch (error) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream);

}