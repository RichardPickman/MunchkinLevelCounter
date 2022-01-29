import { useRouter } from "next/router"
import styles from './Index.module.css'


export const Home = ({ onExit }) => {
    const router = useRouter()
    const returnHome = () => {
        onExit({ isActive: false })
    }

    return (
        <button onClick={returnHome} className={styles.ctrl}> Home </button>
    )
}
