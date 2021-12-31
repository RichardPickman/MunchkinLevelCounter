import  styles  from '../styles/Home.module.css'
import  Link  from 'next/link'
import React, { useState, useEffect } from 'react'


export default function Home() {
    
    return (
        <main>
            <div className={styles.btngroup}>
                <Link href='/createGame'>
                    <button>Create game</button> 
                </Link>
                <Link href='/joinGame'> 
                    <button>Join game</button> 
                </Link>
            </div>
        </main>
    )
}