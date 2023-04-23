import { useEffect, useState } from "react";
import { getCardsByProfile } from "../../util/profileMSQueries";
import { Link } from "react-router-dom";
import GraphQLQuery from "../../util/graphQLQuery";
import { Avatar, Button, Card, CardHeader, Container, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const ProfileCards = ({profile}) => {
    const [cards, setCards] = useState([]);

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
                            <IconButton aria-label="settings">
                               <DeleteIcon />
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