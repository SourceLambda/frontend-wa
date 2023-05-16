import { useEffect, useState } from "react";
import { deleteAddress, getAddressesByProfile } from "../../util/profileMSQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import { Link, Route } from "react-router-dom";
import { Avatar, Box, Button, ButtonBase, ButtonGroup, Card, CardHeader, Container, IconButton, Menu, MenuItem, Modal, Typography } from "@mui/material";

const ProfileAddresses = ({profile}) => {
    const [addresses, setAddresses] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElModal, setAnchorElModal] = useState(false);

    const open = Boolean(anchorEl);
    const openModal = Boolean(anchorElModal);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseModal = () => {
        setAnchorElModal(null);
    };
    const handleOpenModal = () => {
        setAnchorElModal(true);
    };

    const [error, setError] = useState([]);

    useEffect(() => {
        
        const query = getAddressesByProfile(profile.idProfile);
        const getAddresses = async() => {
            const res = await GraphQLQuery(query);
            const jsonRes = await res.json();

            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }
            setAddresses(jsonRes.data.addressessByProfileId);
        }
        getAddresses();
    }, []);

    const handleDelete = async (event, id_addr) => {
        event.preventDefault();

        const query = deleteAddress(profile.idProfile, id_addr);
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
                {'Mis Direcciones'}
            </Typography>
            {addresses.map(addr => {
                return( 
                    <>
                    <br />
                    <Card sx={{ maxWidth: 500 }} key={addr.idAddress}>
                        <CardHeader
                            avatar={
                            <Avatar aria-label="recipe">
                                C
                            </Avatar>
                            }
                            action={
                                <IconButton aria-label="settings">
                                    <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>  
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                            </svg>
                                            <Link to={`/profile/addresses/edit-address/${addr.idAddress}`}>Editar</Link>
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>
                                            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                            </svg>
                                            <Link to={`/profile/addresses`} onClick={(e) => {
                                                handleClose();
                                                handleOpenModal();
                                                handleDelete(e, addr.idAddress);
                                            }}>
                                                Eliminar
                                            </Link>
                                            <Modal
                                                open={openModal}
                                                onClose={handleCloseModal}
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
                                                        {error != null ? 'Dirección eliminada de su cuenta.': 'La información de su dirección no pudo ser liminada.'}
                                                    </Typography>
                                                    <br />
                                                    <Link to={'/profile'}>
                                                        <Button variant="contained" size="large">
                                                            {'Ok'}
                                                        </Button>
                                                    </Link>
                                                    
                                                </Box>
                                            </Modal>
                                        </MenuItem>
                                        
                                    </Menu>
                                </IconButton>
                            }
                            title={addr.address}
                            subheader={addr.detailAddress}
                        />
                    </Card>                        
                    </>

                );
            })}
            <br />
            <Link to={'/profile/addresses/new'}>
                <Button variant="contained" size="large">
                    Agregar Dirección
                </Button>                
            </Link>

        </Container>
    );
}

export default ProfileAddresses;