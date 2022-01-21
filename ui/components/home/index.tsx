import { useRouter } from "next/router"


export const Home = ({ onExit }) => {
    const router = useRouter()
    const returnHome = () => {
        onExit({key: 'isActive', value: 'Offline'})
        router.push('/', undefined, { shallow: true })
    }

    return (
        <button onClick={returnHome}> Home </button>
    )
}
