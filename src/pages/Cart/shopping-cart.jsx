import React, { useState, useEffect } from "react"
import { getCartInfo, removeItem} from "../../util/CartQueries";
import GraphQLQuery from "../../util/graphQLQuery"
import { Typography,Card,CardContent, Button} from "@mui/material";
//import DeleteIcon from '@mui/icons-material/Delete';
let userId="903aa2d8-cb59-11ed-afa1-0242ac120002"

const ShowCart = () => {
    const [cart, setCart] = useState(null)
    useEffect(() => {

        const query = getCartInfo("903aa2d8-cb59-11ed-afa1-0242ac120002");

         async function getCart () {
    
            const response = await GraphQLQuery(query)

            // apigateway have no response from ms
            const jsonRes = await response.json()

            if (jsonRes.data === null || jsonRes.errors) {
             	return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes.errors[0]});
            }
            setCart(jsonRes.data.getCartInfo)

        }
        getCart()
          .catch((err) => {console.log(err)})

    }, [])

const deleteItem = (id) => {
    //el id debe ser { "itemId": "100"} donde 100 es el id del item

    const query = removeItem(userId, id );
    console.log(query)
    const response = GraphQLQuery(query)
    const jsonRes = response.json()
    if (jsonRes.errors) {
        return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes.errors[0]});
    }
    console.log(jsonRes.data)
}


    return (
        <div>
            <Typography variant="h4">Carrito de Compras</Typography>
            <div>
                {
                cart?.items.map((item) => (
                    <Card>

                    <CardContent sx={{ minWidth: 275 ,border:'1px solid #E39050',width:1/4}} >   
                   
                        <Typography>Producto: {item.name}</Typography>
                        <Typography>Precio: {item.price} </Typography>
                        <Typography>Cantidad: {item.quantity} </Typography>
                    <Button variant="contained" onClick={     
                        async () => {
                            console.log(item)
                            console.log(cart.items)
                            deleteItem(item.itemId)
                            //elimina el item de la vista
                            console.log(cart.items)
                            setCart(cart.items.filter((i) => i.itemId !== item.itemId))
                        }
                    }>Eliminar</Button>
                    </CardContent>
                    
                    </Card>

                ))
                }
            </div>
        </div>
    )
}

export default ShowCart