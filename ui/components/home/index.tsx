import { useRouter } from "next/router"


export const Home = ({ onClick }) => {
    const router = useRouter()
    const returnHome = () => {
        onClick({key: 'isInside', value: 0})
        router.push('/', undefined, { shallow: true})
    }

    return (
        <button onClick={returnHome}> Home </button>
    )
}