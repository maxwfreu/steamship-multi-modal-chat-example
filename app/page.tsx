'use client'
 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BotIcon, SendIcon, UserIcon } from 'lucide-react';

const useBlockUrl = (blockId: string) => {
  const [url, setUrl] = useState<string | undefined>()
  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(`/api/steamship/${blockId}`)
      const body = await res.blob()
      setUrl(URL.createObjectURL(body))
    }
    if (!url) {
    fetchImage()

    }
  }, [blockId])
  return url
}

const SteamshipImage = ({blockId}: {blockId: string}) => {
  const url = useBlockUrl(blockId)
  if (!url) {
    return <Skeleton className='w-44 h-44' />
  }

  return <img src={url} className='w-auto h-44' />
};

const SteamshipAudio = ({blockId, mimeType}: {blockId: string, mimeType: string}) => {
  const url = useBlockUrl(blockId)

  if (!url) {
    return <Skeleton className='w-44 h-2' />
  }

  return(
    <audio controls>
      <source src={url} type={mimeType} />
    </audio>
  )
};


const SteamshipMessage = ({message}: {message: string}) => {
  try {
    const messageJson = JSON.parse(message) as {text: string, id?: string, fileId?: string, mimeType?: string} []
    const audioMessage = messageJson.find(m => m.fileId && m.mimeType?.indexOf('audio') !== -1)
    if (audioMessage && audioMessage.id && audioMessage.mimeType) {
      return <SteamshipAudio blockId={audioMessage.id} mimeType={audioMessage.mimeType} />
    }

    return messageJson.map((m, i) => {
      if (m.id && m.mimeType?.indexOf("image") !== -1) {
        return <SteamshipImage key={i} blockId={m.id} />
      }
      let text = m.text
      if (m.text.startsWith('. ')) {
        text = m.text.slice(2)
      }
      return <span key={i} className="block">{text}</span>
    })
  } catch(e) {
    return message
  }
}
 
export default function SloganGenerator() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ id: '123' })
  return (
    <div className="w-screen max-w-3xl mx-auto h-screen flex flex-col justify-between">
      <div className=" px-4 py-2 flex-grow overflow-scroll flex flex-col-reverse">
        <div>
        {messages.map(m => (
          <div key={m.id} className='border border-white/10 text-white px-2 py-4 rounded-md mb-4 flex gap-4'>
            <div className="">{m.role === 'user' ? <UserIcon className='h-6 w-6' /> : <BotIcon className='h-6 w-6' />}</div>
            <div className='space-y-2'>
              <SteamshipMessage message={m.content} />
            </div>
          </div>
        ))}
        {isLoading && (
          <div>
            Assistant is responding...
          </div>
        )}
        </div>

      </div>
      <form onSubmit={handleSubmit} className='flex gap-4 px-2 pt-2 pb-12'>
          <label className='flex-grow'>
            <Input placeholder='Say something...' value={input} onChange={handleInputChange} className="flex-grow" />
          </label>
          <Button type="submit"><SendIcon className='h-6 w-6' /></Button>
        </form>
    </div>
  );
}