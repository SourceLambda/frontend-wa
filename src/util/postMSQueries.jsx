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

export function getProductsQuery(numPage, categoryID) {
    return `
    query {
        allPosts(${categoryID ? `category: ${categoryID}, ` : ""}page:${numPage || 1}) {
            ID
            Title
            CategoryID
            Image
            Description {
                Description_text
                Brand
                Tech_details
                Other_details
            }
            Units
            Price
            Sum_ratings
            Num_ratings
        }
    }
    `
}

export function createPostMutation(postData) {

    const techDetsString = postData.techDetails.reduce((acc, ite) => acc+`"${ite}", `, "[")+"]"
    const otherDetsString = postData.otherDetails.reduce((acc, ite) => acc+`"${ite}", `, "[")+"]"
    
    const query = `
    mutation {
        createPost(post: {
            Title: "${postData.Title}"
            CategoryID: ${postData.CategoryID}
            Image: "${postData.imageURL}"
            Description: {
                Description_text: "${postData.description.Description_text}"
                Brand: "${postData.description.Brand}"
                Tech_details: ${techDetsString}
                Other_details: ${otherDetsString}
            }
            Creation_date: "${postData.Creation_date}"
            Units: ${postData.Units}
            Price: ${postData.Price}
        })
    }
    `;
    return query
}