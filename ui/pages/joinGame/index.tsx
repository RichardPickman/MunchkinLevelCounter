import { useRef, useState, useEffect } from 'react'
import Router from 'next/router';

export default function joinGame() {
    const ws = useRef<WebSocket|null>(null);
    const [sessionId, setSessionId] = useState<{sessionId: string | null}>({sessionId: null});

    const handleInput = event => {
        setSessionId(event.target.values);
      };
    

    function redirectToGame() {

    };

    return (
        <form>
          <input onChange={handleInput} placeholder='Enter id' required />
          <button onClick={redirectToGame} >Вступить в бой</button>
        </form>
      )
};

