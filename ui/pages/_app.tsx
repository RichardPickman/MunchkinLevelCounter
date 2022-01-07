import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useRef, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    const ws = useRef<WebSocket|null>(null);
    const [connected, setConnected] = useState(false)
    const [me, setMe] = useState<{ playerId: string | null }>(null);
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);
    const [sessionId, setSessionId] = useState()

    useEffect(() => {
        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_HOST)

        ws.current.onmessage = (message) => {
            const mess = JSON.parse(message.data)
            console.log(mess)
    
            if (mess.playerId) {
                setMe(mess.playerId)

            } else if (mess.sessionId) {
                setSessionId(mess.sessionId)
                setPlayers(mess.players)
            }
        };
        

        ws.current.onopen = (event) => {
            setConnected(true)
        }
    
        return () => ws?.current.close();
    }, []);

    if (!connected) {
        return (
        <div> 
            <h1> YOU ARE DISCONNECTED</h1> 
        </div>
        )
    }

    return <Component {...{connected, me, players, sessionId, ws, ...pageProps}} />
}

export default MyApp
