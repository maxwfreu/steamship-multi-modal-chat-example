import { StreamingTextResponse } from 'ai';

// Set the runtime to edge for best performance
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const {messages} = await req.json() as { messages: { role: 'user' | 'assistent'; content: string }[]}
  const mostRecentUserMessage = messages.reverse().find(message => message.role === 'user')
  const steamshipResponse = await fetch('https://viable-house.steamship.run/logobot-example-03c/logobot-example-03c/prompt', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.STEAMSHIP_API_KEY}`
    },
    method: 'POST',
    body: JSON.stringify({
      question: mostRecentUserMessage?.content,
      chat_session_id: '1234',
    }),
  })
  return new StreamingTextResponse(steamshipResponse.body as ReadableStream<any>);
}
