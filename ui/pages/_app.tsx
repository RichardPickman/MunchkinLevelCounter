import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useRef, useState } from 'react';
import { handleStorage } from '../components/storage'

function MyApp({ Component, pageProps }: AppProps) {
    const ws = useRef<WebSocket|null>(null);
    const [connected, setConnected] = useState(false)
    const [playerId, setPlayerId] = useState<{ playerId: string | null }>(null);
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);
    const [sessionId, setSessionId] = useState()

    useEffect(() => {
        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_HOST)

        ws.current.onmessage = (message) => {
            const mess = JSON.parse(message.data)
            const payload = {
                id: mess.playerId,
                action: 'add'
            }
    
            if (mess.playerId) {
                const setPlayer = handleStorage(payload)
                setPlayerId(setPlayer)
                console.log('YOUR PERMANENT ID IS: ' + playerId)
            } else if (mess.sessionId) {
                setSessionId(mess.sessionId)
                setPlayers(mess.players)
            }
        };
        
        ws.current.onopen = () => {
            setConnected(true)
            console.log('LOG: CONNECTED TO SERVER')
            const storageAction = handleStorage({action: 'get'})

            if (storageAction === null) {
                console.log('LOG: NO STORAGE DATA... REQUESTING NEW ID')
                ws.current.send(JSON.stringify({ storageId: 'getId' }))
            } else {
                setPlayerId(storageAction)
                console.log('LOG: PLAYER ID FOUND. YOUR ID: ' + playerId)
            }
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

    return <Component {...{connected, playerId, players, sessionId, ws, ...pageProps}} />
}

export default MyApp
