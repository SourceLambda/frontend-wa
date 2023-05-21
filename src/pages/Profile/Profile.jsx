import { useContext, useEffect, useState } from "react";
import { getProfileById } from "../../util/profileMSQueries";
import {  Link, json } from "react-router-dom";
import GraphQLQuery from "../../util/graphQLQuery";
import { Button, Card, CardActions, CardContent, Container, Typography} from "@mui/material";

const Profile = ({profile}) => {

    return(
        <Container>
            <br />
            <Card sx={{ maxWidth: 500 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom >
                        {profile.firstname + " " + profile.lastname}
                    </Typography>
                    
                </CardContent>
                <CardActions>
                    <Link to={"/profile/profilepage"}>
                        {'Ver Datos'}
                    </Link>
                </CardActions>
            </Card>
            <br />
            <Card sx={{ minWidth: 375 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                        Mis Tarjetas
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Tarjetas guardadas en tu cuenta
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link to={'/profile/cards'}>
                        {'Ver Tarjetas'}
                    </Link>
                </CardActions>
            </Card>          
            <br />
            <Card sx={{ minWidth: 375 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                        Mis Direcciones
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Direcciones guardadas en tu cuenta
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link to={'/profile/addresses'}>
                        {'Ver Direcciones'}
                    </Link>
                </CardActions>
            </Card>          
        </Container>

    );
}

export default Profile;

        {/* <div>
            <h1>{profile.firstname + " " + profile.lastname}</h1>
            <p>Información de tu perfil</p>

            <div>
                <Link to={'/profile/profilepage'}>
                    <h3>Mis Datos</h3>
                </Link>
                <p>Datos validos</p>

                <Link to={'/profile/addresses'}>
                    <h3>Direcciones</h3>
                </Link>
                <p>Direcciones guardadas en tu cuenta</p>

                <Link to={'/profile/cards'}>
                    <h3>Tarjetas</h3>
                </Link>
                <p>Tarjetas guardadas en tu cuenta</p>
            </div>
        </div> */}