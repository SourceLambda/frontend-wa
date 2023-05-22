import React, { useState, useEffect } from "react"
import { getBillsQuery } from "../../util/PlaceOrderQueries";
import GraphQLQuery from "../../util/graphQLQuery"
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Grid, Typography} from "@mui/material";

const DEFAULT_BILLS =[ {
    idCliente: "loading...",
    total: 0,
    date: "loading...",
    user: "loading...",
    state: "loading...",
    products: [
        {
            name: "loading...",
            description: "loading...",
            price: 0,
            quantity: 0
        }
    ]
}
]

let userId = localStorage.getItem('user-id')

const BillHistory = () => {
    const [bills, setBills] = useState(DEFAULT_BILLS)
    useEffect(() => {

        const query = getBillsQuery(userId);

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
                    <Accordion sx={{ background:'#eeeeee' }}>
                    <AccordionSummary expandIcon="v"
                    aria-controls="panel1a-content"  sx={{ color: '#ec4e20'}}>
                        <Typography>Factura: {bill.date}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                            <Typography>Usuario: {bill.user}</Typography>
                            <Typography>Estado: {bill.state} </Typography>
                            <Typography>Total: {bill.total}</Typography>
                            <Typography>Productos:</Typography>
                            {
                                bill.products.map((product) => (                              

                                    <Card key={bill.idBill}>
                                        <CardContent sx={{ minWidth: 400 ,border:'2px solid #E39050',borderRadius:4 ,width:1/4 ,m:'5px'}}>   
                                        <Typography>Nombre: {product.name}</Typography>
                                        <Typography>Descripción: {product.description}</Typography>
                                        <Typography>Precio: {product.price}</Typography>
                                        <Typography>Cantidad: {product.quantity}</Typography>
                                        </CardContent>
                                    </Card>
                     
                                ))    
                            }
                           
                    </AccordionDetails>
                    <br></br>
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