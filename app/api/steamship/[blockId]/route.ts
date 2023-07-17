import { Configuration } from 'openai-edge';
import { StreamingTextResponse } from 'ai';
 
// Set the runtime to edge for best performance
export const runtime = 'edge';
 
// @ts-ignore
export async function GET(req: Request, context: { params }) {
  const blockId = context.params.blockId;
  const steamshipResponse = await fetch(`https://api.steamship.com/api/v1/block/${blockId}/raw`, {
    headers: {
      'Authorization': `Bearer ${process.env.STEAMSHIP_API_KEY}`,
      'X-Workspace-Handle': 'logobot-example-03c',
    },
    method: 'GET',
  })
  return steamshipResponse
}

