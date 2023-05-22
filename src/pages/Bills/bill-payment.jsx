import React, { useState, useEffect } from "react"
import GraphQLQuery from "../../util/graphQLQuery"
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, Grid, Typography} from "@mui/material";
import { createBill } from "../../util/PlaceOrderQueries";
import { Link } from "react-router-dom";

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

const ShowBill = () => {

    const [bill, setBill] = useState(DEFAULT_BILL);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
const loadBill = async () => {

    const  prueba= localStorage.getItem("Bill");

    const  bill1=JSON.parse(prueba);
    console.log(bill1);

    setBill(bill1);
    setIsLoading(false);
};

    loadBill();
    }, []   );



    return (
        <div>
        <Typography variant="h5" color ='secondary'  m='5px' component="div">
            Tu factura de compra es:
                        </Typography>

            <Card>
                <CardContent  sx={{ margin:'20px' ,minWidth: 400 ,border:'2px solid #E39050',borderRadius:4 ,width:1/2}}>

                  
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Total : {bill.total}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Fecha: {bill.date}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Usuario: {bill.user}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Estado: {bill.state}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
                        {bill.products.map((product) => (
                            <Accordion key={product.name}>
                                <AccordionSummary
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Producto: {product.name}</Typography>
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
        <Link to={'/'}> <Button variant="contained" color='secondary' sx={{ m: '20px' }}>Volver al inicio</Button> </Link>

        </div>

    )
}

export default  ShowBill