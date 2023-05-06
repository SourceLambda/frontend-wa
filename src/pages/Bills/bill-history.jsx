import React, { useState, useEffect } from "react"
import { getBillsQuery } from "../../util/PlaceOrderQueries";
import GraphQLQuery from "../../util/graphQLQuery"
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Grid, Typography} from "@mui/material";


const DEFAULT_BILLS =[ {
    idCliente: "1",
    total: 5,
    date: "2022-040-21",
    user: "Johan",
    state: "Pending",
    products: [
        {
            name: "Pizza",
            description: "Sara Valentina",
            price: 2,
            quantity: 2
        }
    ]
},
{
    idCliente: "1",
    total: 5,
    date: "2022-040-21",
    user: "Johan",
    state: "Pending",
    products: [
        {
            name: "Pizza",
            description: "Sara Valentina",
            price: 2,
            quantity: 2
        },
        {
            name: "Pizza",
            description: "Sara Valentina",
            price: 2,
            quantity: 2
        }
    ]
}
]

const BillHistory = () => {
    const [bills, setBills] = useState(DEFAULT_BILLS)
    useEffect(() => {

        const query = getBillsQuery();

         async function getBills () {
    
			const response = await GraphQLQuery(query)

			// apigateway have no response from ms
			const jsonRes = await response.json()

			if (jsonRes.data === null || jsonRes.errors) {
			 	return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes.errors[0]});
			}
			setBills(jsonRes.data.historyByClientId)

        }
        getBills()
          .catch((err) => {console.log(err)})

    }, [])
    return (
        <div>
            <Typography variant="h4">Historial de Compras</Typography>
            <div>
                {
                bills.map((bill) => (
                    <Accordion>
                    <AccordionSummary expandIcon="v"
                    aria-controls="panel1a-content">
                        <Typography>Factura: {bill.date}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                            <Typography>Usuario: {bill.user}</Typography>
                            <Typography>Estado: {bill.state} </Typography>
                            <Typography>Total: {bill.total}</Typography>
                            <Typography>Productos:</Typography>
                            {
                                bill.products.map((product) => (
                                   
                                    <Card>
                                         
                                        <CardContent sx={{ minWidth: 275 ,bgcolor:'beige'}} >   
                                        <Typography>Nombre: {product.name}</Typography>
                                        <Typography>Descripción: {product.description}</Typography>
                                        <Typography>Precio: {product.price}</Typography>
                                        <Typography>Cantidad: {product.quantity}</Typography>
                                        </CardContent>
                                    </Card>
                                 
                                ))    
                            }
                            
                    </AccordionDetails>
                    </Accordion>
                ))
                }
            
            </div>
            
        </div>


        // <><div>
        //     <h1>Historial de Compras</h1>
        // </div><div>
        //         <table>
        //             <thead>
        //                 <tr>
        //                     <th>Fecha</th>
        //                     <th>Usuario</th>
        //                     <th>Estado</th>
        //                     <th>Productos</th>
        //                     <th>Total</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {bills.map((bill) => (
        //                     <tr>
        //                         <td>{bill.date}</td>
        //                         <td>{bill.user}</td>
        //                         <td>{bill.state}</td>
        //                         <td>
        //                             <table>
        //                                 <thead>
        //                                     <tr>
        //                                         <th>Nombre</th>
        //                                         <th>Descripción</th>
        //                                         <th>Precio</th>
        //                                         <th>Cantidad</th>
        //                                     </tr>
        //                                 </thead>
        //                                 <tbody>
        //                                     {bill.products.map((product) => (
        //                                         <tr>
        //                                             <td>{product.name}</td>
        //                                             <td>{product.description}</td>
        //                                             <td>{product.price}</td>
        //                                             <td>{product.quantity}</td>
        //                                         </tr>
        //                                     ))}
        //                                 </tbody>
        //                             </table>
        //                         </td>
        //                         <td>{bill.total}</td>
        //                     </tr>
        //                 ))}
        //             </tbody>
        //         </table>
        //     </div></>

    )
}

export default  BillHistory