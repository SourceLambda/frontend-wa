export function getCartInfo(userId){
    return `
    query {
        getCartInfo(userId:"${userId}"){
            items {
                itemId
                name
                price
                quantity
              }
        }
    }
    `;
}   
export function removeItem(userId="903aa2d8-cb59-11ed-afa1-0242ac120002",item){
    return `
    mutation {
        removeItem(userId:"${userId}",item:"${item}"){
            items {
                itemId
                quantity
              }
        }
    }
    `;
}
export function addItem(userId,item){
    return `
    mutation {
        addItem(userId:"${userId}",item:"${item}"){
            items {
                itemId
                quantity
              }
        }
    }
    `;
}
export function deleteCart(userId){
    return `
    mutation {
        deleteCart(userId:"${userId}"){
            items {
                itemId
            }
        }
    }
    `;
}