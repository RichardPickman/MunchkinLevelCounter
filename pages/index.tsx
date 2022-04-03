import { App } from '../components/App';
function Home(props) {
    return <App host={props.config.host} />
}

Home.getInitialProps = (context) => {
    return {
        config: {
            host: context.req.headers.host,
        },
    };
};

export default Home;
