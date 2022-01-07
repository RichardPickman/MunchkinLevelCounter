import { useRouter } from 'next/router';
import { useRef, useState } from 'react'
import styles from './index.module.css'

export default function joinGame() {
    const router = useRouter();
    const sessionIdRef = useRef();

    function submitHandler(event) {
        event.preventDefault();

        const enteredSessionId = sessionIdRef.current.value;
        

        router.push({
            pathname: '/[gameId]',
            query : {gameId: enteredSessionId}
            });
    }

    return (
          <form onSubmit={submitHandler}>
            <div>
              <label htmlFor='sessionId'>Address</label>
              <input type='text' required id='sessionId' ref={sessionIdRef} />
            </div>
            <div>
              <button>Add Meetup</button>
            </div>
          </form>
      );
};

