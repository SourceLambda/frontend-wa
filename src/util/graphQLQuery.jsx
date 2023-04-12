const graphQLAddress = 'http://localhost:5000/graphql';

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