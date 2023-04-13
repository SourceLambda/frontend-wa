import { useState } from "react"
import { useParams } from "react-router-dom"

const ProductInfoPage = () => {

    const [product, setProduct] = useState(undefined)

    const { id } = useParams('id')

    return (
        product ? 
        <div>
            <h3>{product.Title}</h3>
            <img src={product.Image} alt={product.Title + " Image"} width='300px'></img>
            <b>{product.Description.Brand}</b>
            <p>{product.Description.Description_text}</p>
            <ul>
                {product.Description.Tech_details.map(detail => <li key={detail}>{detail}</li>)}
            </ul>
            <ul>
                {product.Description.Other_details.map(detail => <li key={detail}>{detail}</li>)}
            </ul>
            <p>Unidades: {product.Units}</p>
            <p>Precio: {product.Price}</p>
            <p>Rating: {(product.Sum_ratings / product.Num_ratings) || product.Num_ratings}</p>
        </div>
         : <div></div>
    )
}

export default ProductInfoPage