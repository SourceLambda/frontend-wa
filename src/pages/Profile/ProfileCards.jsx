import { useEffect, useState } from "react";
import { deleteCard, getCardsByProfile } from "../../util/profileMSQueries";
import { Link } from "react-router-dom";
import GraphQLQuery from "../../util/graphQLQuery";
import { Avatar, Box, Button, Card, CardHeader, Container, IconButton, Modal, Typography } from "@mui/material";

const ProfileCards = ({profile}) => {
    const [cards, setCards] = useState([]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDelete = async (event, id_card) => {
        event.preventDefault();

        const query = deleteCard(profile.idProfile, id_card);
        const res = await GraphQLQuery(query);
        const jsonRes = await res.json();

        if (jsonRes.data === null || jsonRes.errors) {
            return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
        }
    }

    useEffect(() => {
        const query = getCardsByProfile(profile.idProfile);
        const getCards = async() => {
            const res = await GraphQLQuery(query);
            const jsonRes = await res.json();

            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }
            setCards(jsonRes.data.cardsByProfileId);
        }
        getCards(); 
    }, []);

    return(
        <Container>
            <br />
            <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                {'Mis Tarjetas'}
            </Typography>
            {cards.map(card => {
                return(
                    <>
                    <br />
                    <Card sx={{ maxWidth: 500 }} key={card.idCard}>
                        <CardHeader
                            avatar={
                            <Avatar aria-label="recipe">
                                MC
                            </Avatar>
                            }
                            action={
                            <IconButton aria-label="settings" >
                                <svg onClick={handleOpen} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
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
                                            Eliminar Tarjeta
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            Está seguro que quiere eliminar la tarjeta de su cuenta?
                                        </Typography>
                                        <br />
                                        <Link to={'/profile'} onClick={(e) => {
                                                handleClose();
                                                handleDelete(e, card.idCard);
                                            }}>
                                            <Button variant="contained" size="large">
                                                {'Ok'}
                                            </Button>                                            
                                        </Link>
                                    </Box>
                                </Modal>     
                            </IconButton>
                            
                            }
                            title={card.cardNickname}
                            subheader={card.cardNumber}
                        />
                    </Card>                        
                    </>

                );
            })}
            <br />
            <Link to={'/profile/cards/new'}>
                <Button variant="contained" size="large">
                    Agregar Tarjeta
                </Button>
            </Link>
            
        </Container>
    );
}

export default ProfileCards;
{/*         <div>
            <h1>Tarjetas</h1>
            <Link>Añadir nueva tarjeta</Link>
            {cards.map(card => {
                return(
                    <div key={card.idCard}>
                        <h2>{card.cardNickname}</h2>
                        <p>{card.cardNumber}</p>
                    </div>
                );
            })}
        </div> */}