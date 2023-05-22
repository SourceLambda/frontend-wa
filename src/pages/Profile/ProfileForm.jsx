import { Box, Button, Container, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { updateProfile } from "../../util/profileMSQueries";
import GraphQLQuery from "../../util/graphQLQuery";

const ProfileForm = ({profile}) => {

    const [firstname, setFirstname] = useState(profile.firstname);
    const [lastname, setLastname] = useState(profile.lastname);
    const [telNumber, setTelNumber] = useState(profile.telNumber);
    const [email, setEmail] = useState(profile.email);
    const [password, setPassword] = useState(profile.password);
    const [birthday, setBirthday] = useState(profile.birthday);
    const [alternativeNumber, setAlternativeNumber] = useState(profile.alternativeNumber);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [error, setError] = useState([]);

    const handleForm = async (event) => {
        event.preventDefault();

        const updatedProfile = {
            idProfile: profile.idProfile,
            firstname: firstname,
            lastname: lastname,
            telNumber: telNumber,
            email: email,
            password: password,
            birthday: birthday,
            alternativeNumber: alternativeNumber,
            role: profile.role
        }
        const query =  updateProfile(profile.idProfile, updatedProfile);
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
                {'Editar Datos Personales'}
            </Typography>
            <Box 
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            > 
                <TextField id="first_name" onChange={(e) => {setFirstname(e.target.value)}} label="Nombre" type="search" value={firstname}/>            
                <TextField id="last_name"  onChange={(e) => {setLastname(e.target.value)}} label="Apellidos" type="search" value={lastname} />            
                <TextField id="tel_number"  onChange={(e) => {setTelNumber(parseFloat(e.target.value, 10))}} label="Número de Teléfono" type="search" value={telNumber} />            
                <TextField id="other_number"  onChange={(e) => {setAlternativeNumber(parseFloat(e.target.value, 10))}} label="Número de Teléfono Alternativo" type="search" value={alternativeNumber} />            
                <TextField id="emaill"  onChange={(e) => {setEmail(e.target.value)}} label="Correo" type="search" value={email} />            
                <TextField id="contraseña"  onChange={(e) => {setPassword(e.target.value)}} label="Contraseña" type="password" value={password} />
                <TextField id="birth_day"  onChange={(e) => {setBirthday(e.target.value)}} label="Fecha de Nacimiento" type="date" value={birthday} />     
                
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
                            {error != null ? 'Datos personales actualizados': 'Verique la información proveída'}
                        </Typography>
                        <br />
                        <Link to={'/profile'}>
                            <Button variant="contained" size="large" onClick={(e) => e.returnValue = true}>
                                {'Ok'}
                            </Button>
                        </Link>
                        
                    </Box>
                    
                </Modal>                      
            </Box>

        </Container>
    );
}

export default ProfileForm;