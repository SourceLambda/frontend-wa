export function getCategoriesQuery() {
    return `
    query {
        allCategories {
            ID
            Parent_CategoryID
            Name
        }
    }
    `;
}

export function createPostMutation(postData) {
    const query = `
    mutation {
        createPost(post: {
            Title: "${postData.Title}"
            CategoryID: ${postData.CategoryID}
            Image: "${postData.imageURL}"
            Description: {
                Description_text: "${postData.description.Description_text}"
                Brand: "${postData.description.Brand}"
            }
            Creation_date: "${postData.Creation_date}"
            Units: ${postData.Units}
            Price: ${postData.Price}
        })
    }
    `;
    return query
}
//el id del cliente se debe obtener del local storage
export function getBillsQuery() {
    return `
    query {
        historyByClientId(idCliente: 101) {
            idCliente
            total
            date
            user
            state
            products{
                name
                description
                price
                quantity
            }
        }
    }
    `;
}