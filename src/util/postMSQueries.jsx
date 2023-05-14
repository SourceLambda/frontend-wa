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

export function getProductQuery(postID) {
    return `
    query {
        postById(ID:${postID}) {
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

export function productMutation(postID, postData, dataType) {

    const techDetsString = postData.techDetails.reduce((acc, ite) => acc+`"${ite}", `, "[")+"]"
    const otherDetsString = postData.otherDetails.reduce((acc, ite) => acc+`"${ite}", `, "[")+"]"
    
    const query = `
    mutation {
        ${dataType}Post(${postID ? `ID:${postID} ` : ""}post: {
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

export function deleteProdMutation (postID) {
    const query = `
    mutation {
        deletePost(ID: ${postID})
    }
    `;
    return query
}

export function getReviewsQuery (page, postID) {

    if (page && postID) {
        throw new Error("getReviewsQuery() must have only one parameter.")
    }

    const query = `
    query {
        allReviews(${page ? `page: ${page}` : `postID: ${postID}`}) {
            ID
            ${!postID ? 'PostID' : ''}
            User_name
            User_email
            Rating
            Review_text
        }
    }
    `;
    return query
}

export function getReviewQuery (reviewID) {
    const query = `
    query {
        reviewById(ID: ${reviewID}) {
            PostID
            User_name
            User_email
            Rating
            Review_text
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
    return query
}

export function reviewMutation (reviewID, reviewData, dataType) {
    const query = `
    mutation {
        ${dataType}Review(${reviewID ? `ID: ${reviewID}` : ''} review: {
            PostID: ${reviewData.PostID}
            User_name: "${reviewData.User_name}"
            User_email: "${reviewData.User_email}"
            Rating: ${reviewData.Rating}
            ${reviewID ? `OldRating: ${reviewData.OldRating}` : ''}
            Review_text: "${reviewData.Review_text}"
        })
    }
    `;
    return query
}

export function deleteReviewMutation (reviewID, body) {
    const query = `
    mutation {
        deleteReview(ID: ${reviewID} body: {
            PostID: ${body.PostID}
            OldRating: ${body.OldRating}
        })
    }
    `;
    return query
}
