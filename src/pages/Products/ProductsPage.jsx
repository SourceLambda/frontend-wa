import { useContext, useEffect, useState } from "react";
import { getProductsQuery } from "../../util/postMSQueries";
import { Link, useSearchParams } from "react-router-dom";
import GraphQLQuery from "../../util/graphQLQuery";
import { ProductContext } from "../../App";

const ProductCard = ({ product }) => {

    const { setSelectedProduct } = useContext(ProductContext)

    return (
        <div>
            <Link to={`/products/${product.ID}`} onClick={() => setSelectedProduct(product)}>
                <h3>{product.Title}</h3>
            </Link>
            <img src={product.Image} alt={product.Title + " Image"} width='200px'></img>
            <p><b>{product.Description.Brand}</b></p>
            <p>{product.Description.Description_text}</p>
            <p>Precio: {product.Price}</p>
            <p>Rating: {(product.Sum_ratings / product.Num_ratings) || product.Num_ratings}</p>
        </div>
    )
}

const ProductsPage = () => {

    const [products, setProducts] = useState([])
    const [searchParams] = useSearchParams()
    
    useEffect(() => {

        const query = getProductsQuery(searchParams.get('page'), searchParams.get('category'));

        async function getProducts () {
    
			const response = await GraphQLQuery(query)

			// apigateway have no response from ms
			const jsonRes = await response.json()
			if (jsonRes.data === null || jsonRes.errors) {
			 	return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
			}

			setProducts(jsonRes.data.allPosts)

        }
        getProducts()
            .catch((err) => {console.log(err)})

    }, [])

    return (
        <div>
            {products.map(prod => <ProductCard key={prod.ID} product={prod} />)}
        </div>
    )
}

export default ProductsPage