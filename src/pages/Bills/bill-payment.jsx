import React, { useState, useEffect } from "react"
import GraphQLQuery from "../../util/graphQLQuery"
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, Grid, Typography} from "@mui/material";
import { createBill } from "../../util/PlaceOrderQueries";

const DEFAULT_BILL = {
    idCliente: "903aa2d8-cb59-11ed-afa1-0242ac120002",
    date: "2022-04-21T12:00:00.000Z",
    user: "Johan",
    state: "Pending",
    products: [
        {
            idProduct: 1,
            name: "Pizza",
            description: "Sara Valentina",
            price: 2,
            quantity: 2
        }
    ]
}

const CreateBill = (shoppingCart) => {
    const [bill, setBill] = useState(DEFAULT_BILL) //cambiar por el valor del carrito de compras cuando esté listo
   
    return (
        <div>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div">
                        Bill
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {bill.idCliente}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {bill.total}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {bill.date}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {bill.user}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {bill.state}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
                        {bill.products.map((product) => (
                            <Accordion key={product.name}>
                                <AccordionSummary
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Producto:{product.name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                Precio:{product.price}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                Cantidad:{product.quantity}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    
                </CardContent>
            </Card>                        
        <Button variant="contained" onClick={async () => {
            let tempBill = JSON.stringify(bill)
            let finalBill = tempBill.replace(/"([^"]+)":/g, '$1:');
            const query = createBill(finalBill);
            console.log(query)
            const response = await GraphQLQuery(query)
            const jsonRes = await response.json()
            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes.errors[0]});
            }
            console.log(jsonRes.data)
            setBill(jsonRes.data.createBill)
        }}>Create Bill</Button>

        </div>

    )
}

export default CreateBill