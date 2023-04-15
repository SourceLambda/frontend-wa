import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { deleteProdMutation, getProductQuery } from "../../util/postMSQueries"
import GraphQLQuery from "../../util/graphQLQuery"
import { ProductContext } from "../../App"

const ProductInfo = ({ prod, deleteHandler, id }) => {

    if (prod) {
        return (
            <div>
                <h3>{prod.Title} - {id}</h3>
                <img src={prod.Image} alt={prod.Title + " Image"} width='300px'></img>
                <p><b>{prod.Description.Brand}</b></p>
                <p>{prod.Description.Description_text}</p>
                <ul>
                    {prod.Description.Tech_details.map(detail => <li key={detail}>{detail}</li>)}
                </ul>
                <ul>
                    {prod.Description.Other_details.map(detail => <li key={detail}>{detail}</li>)}
                </ul>
                <p>Unidades: {prod.Units}</p>
                <p>Precio: {prod.Price}</p>
                <p>Rating: {(prod.Sum_ratings / prod.Num_ratings) || prod.Num_ratings}</p>
                <Link to={'/edit-product/'}>
                    <button>Editar Producto</button>
                </Link>
                <button onClick={deleteHandler}>Eliminar Producto</button>
            </div>
        )
    }
    return (
        <div>Cargando</div>
    )
}

const ProductInfoPage = () => {

    const { selectedProduct, setSelectedProduct } = useContext(ProductContext)
    const { id } = useParams('id')
    
    const getProductRequest = async () => {
    
        try {
            const query = getProductQuery(id)
            const response = await GraphQLQuery(query)

            // apigateway have no response from ms
            const jsonRes = await response.json()
            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }

            return jsonRes.data.postById
        }
        catch (err) {
            return err
        }
    }

    useEffect(() => {
        if (!selectedProduct) {
            getProductRequest().then(res => {
                res.ID = id
                setSelectedProduct(res)
            })
        }
    }, [])


    const deleteProductRequest = async () => {

        if (!window.confirm('¿Está seguro de borrar este producto?')) {
            return
        }
        try {
            const query = deleteProdMutation(id)
            const response = await GraphQLQuery(query)

            // apigateway have no response from ms
            const jsonRes = await response.json()
            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }
            console.log(jsonRes.data)
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <ProductInfo prod={selectedProduct} deleteHandler={deleteProductRequest} id={id} />
    )
}

export default ProductInfoPage