import { Box, Button, Container, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { createCardToProfile } from "../util/profileMSQueries";
import GraphQLQuery from "../util/graphQLQuery";
import { Link } from "react-router-dom";

const CardForm = ({idProfile}) => {

    const [cardNumber, setCardNumber] = useState(0);
    const [expDate, setExpDate] = useState('');
    const [CVV, setCVV] = useState(0);
    const [cardName, setCardName] = useState('');
    const [cardNickname, setCardNickName] = useState('');

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [error, setError] = useState([]);

    const handleForm = async (event) => {
        event.preventDefault();

        const createCard = {
            cardName: cardName,
            expirationDate: expDate,
            cardNickname: cardNickname,
            cvv: CVV,
            cardNumber: cardNumber
        }
        const query = createCardToProfile(idProfile, createCard);
        const res = await GraphQLQuery(query);
        const jsonRes = await res.json();

        if (jsonRes.data === null || jsonRes.errors) {
            setError(jsonRes.data);
            return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
        }
    }

    return(
        <Container>
            <br />
            <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                {'Nueva Tarjeta'}
            </Typography>
            <Box 
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            > 
                <TextField id="card_number" onChange={(e) => {setCardNumber(parseFloat(e.target.value))}} label="Número de la Tarjeta" type="search" />            
                <TextField id="exp_date"  onChange={(e) => {setExpDate(e.target.value)}} label="Fecha de Expiración" type="date" />            
                <TextField id="cvv"  onChange={(e) => {setCVV(parseInt(e.target.value, 10))}} label="CVV" type="search" />            
                <TextField id="card_name"  onChange={(e) => {setCardName(e.target.value)}} label="Nombre en la Tarjeta" type="search" />            
                <TextField id="card_nickname"  onChange={(e) => {setCardNickName(e.target.value)}} label="Apodo" type="search" />   
                
                <br />
                <br />
                <Button variant="contained" size="large" onClick={(e) => {
                    e.preventDefault();
                    handleForm(e);
                    handleOpen();
                }}>
                    Guardar
                </Button>   
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {error != null ? 'Operación Exitosa': 'Ocurrió un error'}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {error != null ? 'Tarjeta añadida éxitosamente en tu cuenta.': 'Verifique los datos enviados.'}
                        </Typography>
                        <br />
                        <Link to={'/profile/cards'}>
                            <Button variant="contained" size="large">
                                {'Ok'}
                            </Button>
                        </Link>
                        
                    </Box>
                    
                </Modal>                      
            </Box>

        </Container>
    );
}

export default CardForm;

/**nombre en la tarjeta
 * fecha de expiración
 * apodo de la tarjeta
 * cvv
 * numero de la tarjeta
 */