export async function GET(req: Request, context: { params: any }) {
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
