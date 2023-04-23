import { useEffect, useState } from "react";
import { getCardsByProfile } from "../../util/profileMSQueries";
import { Link } from "react-router-dom";
import GraphQLQuery from "../../util/graphQLQuery";
import { Avatar, Card, CardHeader, Container, IconButton } from "@mui/material";
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
            {cards.map(card => {
                return(
                    <>
                    <br />
                    <Card sx={{ maxWidth: 500 }}>
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