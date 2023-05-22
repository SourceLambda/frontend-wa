import { useRef, useState } from "react";
import GraphQLQuery from "../util/graphQLQuery";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { addItem } from "../util/CartQueries";
import SnackBarNotification from "./SnackBarNotification";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
};

const AddCartModal = ({ productTitle, productID }) => {

    const quantityInput = useRef()
    const [isInvalid, setIsInvalid] = useState(false)
    const [snackBarInfo, setSnackBarInfo] = useState({
        message: '',
        barType: 'info',
        time: 3000,
        state: false,
        redirectHandler: () => {}
    })

    const addItemToShoppingCart = async (e) => {
        e.preventDefault()

        const invalidQuantity = quantityInput.current.value < 1;
        setIsInvalid(invalidQuantity)
        if (invalidQuantity) return
    
        try {
            const userId = localStorage.getItem('user-id');

            const query = addItem(userId, {ID: productID, quantity: quantityInput.current.value})
            const response = await GraphQLQuery(query)

            // apigateway have no response from ms
            const jsonRes = await response.json()
            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }

            setSnackBarInfo({
                message: `${productTitle} añadido al carrito.`,
                type: 'success',
                time: 1000,
                state: true,
                redirectHandler: () => window.location.assign('/products')
            })
        }
        catch (err) {
            setSnackBarInfo({
                message: 'Error al añadir el producto al carrito',
                type: 'error',
                time: 1000,
                state: true,
                redirectHandler: () => window.location.assign('/products')
            })
        }
    }

    return (
        <>
            <Box sx={style} >
                <Typography id="modal-modal-title" variant="h5" component="h3">
                    {`Agregar ${productTitle} al Carrito`}
                </Typography>
                <Grid container sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', mt: 1}} spacing={3} >
                    <Grid item >
                        <TextField
                            sx={{width: '200px'}}
                            required
                            id="cart-quantity"
                            name="Quantity"
                            inputRef={quantityInput}
                            type="number"
                            error={isInvalid}
                            helperText={(isInvalid) && 'Ingrése un número válido.'}
                            label="Ingrese la cantidad"
                            variant="outlined"
                            inputProps={{ inputMode: 'numeric', step: 1, min: 1}}
                        />
                    </Grid>
                    <Grid item >
                        <Button onClick={addItemToShoppingCart} color='secondary' >Añadir al Carrito</Button>
                    </Grid>
                </Grid>
            </Box>
            <SnackBarNotification sncBarData={snackBarInfo} />
        </>
    )
}

export default AddCartModal;