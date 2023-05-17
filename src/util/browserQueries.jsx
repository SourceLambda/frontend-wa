export function searchProductsQuery(str){
    return `
    query {
        browse(q: "${str}") {
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
    `;
}   

export function indexProductQuery(productData){
    return `
    mutation {
        index(post: {
          id: "${productData.ID}",
          title: "${productData.Title}",
          desc: "${productData.Description}",
          category: "${productData.Category}"
        })
      }
    `;
}