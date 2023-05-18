import React, { useState, useEffect } from "react"
import { getCartInfo, removeItem, deleteCart} from "../../util/CartQueries";
import GraphQLQuery from "../../util/graphQLQuery"
import { Typography,Card,CardContent, Button} from "@mui/material";
import { Link } from "react-router-dom";
//import DeleteIcon from '@mui/icons-material/Delete';
let userId="903aa2d8-cb59-11ed-afa1-0242ac120002"
let total =0


const ShowCart = () => {
    const [cart, setCart] = useState(null)
    useEffect(() => {

        const query = getCartInfo(userId);

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

        .then((res) => {   })
          .catch((err) => {console.log(err)})

    }, [])


const deleteItem = async (item) => {

    const query = removeItem(userId, item.itemId );
    console.log(query)
    const response =await  GraphQLQuery(query)
    total=total - item.price*item.quantity
    
    const jsonRes =response.json()

  if (jsonRes.errors) {
       return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes.errors[0]});
    }
}
const deleteAll = async (userId) => {
    const query = deleteCart(userId);
    const response =await  GraphQLQuery(query)
    const jsonRes =response.json()
    if (jsonRes.errors) {
         return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes.errors[0]});
        }
}
const totalCart = () => {
    total=0
    cart?.items.map((item) => (
        total=total + item.price*item.quantity
    ))
    return total
}
totalCart()



    return (
        <div>
            <Typography variant="h4">Carrito de Compras</Typography>
            <div>
{
              

                cart?.items.map((item) => (
                          
                    <Card key={item.itemId}>

                    <CardContent sx={{ minWidth: 275 ,border:'1px solid #E39050',width:1/4}} >   
                   
                        <Typography>Producto: {item.name}</Typography>
                        <Typography>Precio: {item.price} </Typography>            
                        <Typography>Cantidad: {item.quantity} </Typography>
                    <Button variant="contained"  onClick={     
                        async () => {
                            console.log(item)
                            console.log(cart.items)
                            await deleteItem(item)
                            //elimina el item de la vista
                            console.log(cart.items)
                            let newCart = cart.items.filter((i) => i.itemId !== item.itemId)
                            console.log(newCart)
                            setCart({ items: newCart})
                        }
                    }>Eliminar</Button>
                    </CardContent>
                    </Card>
                    ))
                }
                <div>
                 
                    <Card sx={{ minWidth: 400 ,border:'1px solid #E39050',width:1/4}} >
                        <CardContent>
              

                            <Typography>Total: $ { total }</Typography>
                            <Link  to={'/bill-payment'}><Button variant="contained" >Pagar</Button> </Link>
                             <Button variant="contained" sx={{margin:'5px ' }}  onClick= {
                                async () => {
    
                                    await deleteAll(userId)
                                    setCart({ items: []})

                            }
                         } >Vaciar Carrito</Button>
                        </CardContent>
                    </Card>
                    </div>

            </div>
        </div>
    )
                        
                        }

export default ShowCart