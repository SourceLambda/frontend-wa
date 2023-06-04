const HOST = import.meta.env.VITE_AG_HOST;
const PORT = import.meta.env.VITE_AG_PORT;

const graphQLAddress = `http://${HOST}:${PORT}/graphql`;

const GraphQLQuery = async (query) => {

    return await fetch(graphQLAddress, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            query,
        }),
    })
}

export default GraphQLQuery