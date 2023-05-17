import { Button, Card, CardActions, CardContent, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ProfilePage = ({profile}) => {
    return(
        <Container>
            <br />
            <Card sx={{ maxWidth: 500 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                        Mis Datos
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Tarjetas guardadas en tu cuenta
                    </Typography>
                    <Typography variant="body2">
                        Nombre: {profile.firstname + ' ' + profile.lastname}
                        <br />
                        Correo: {profile.email}
                        <br />
                        Telefono: {profile.telNumber}
                        <br />
                        Fecha de Nacimiento: {profile.birthday}
                        <br />
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link to={"/profile/profilepage/edit"}>
                        <Button variant="contained">Editar Datos</Button>
                    </Link>
                </CardActions>
            </Card>
        </Container>
    );
}

export default ProfilePage;

/*         <div>
            <h1>Mis Datos</h1>
            <h3>Datos Personales</h3>
            <Link to={'/profile/profilepage/edit'}><p>Editar</p></Link>
            <p>Nombre: {profile.firstname + profile.lastname}</p>
            <p>Correo: {profile.email}</p>
            <p>Telefono: {profile.telNumber}</p>
            <p>Fecha de Nacimiento: {profile.birthday}</p>
            
        </div> */