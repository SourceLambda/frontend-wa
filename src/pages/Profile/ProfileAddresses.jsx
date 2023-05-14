import { useEffect, useState } from "react";
import { deleteAddress, getAddressesByProfile } from "../../util/profileMSQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import { Link, Route } from "react-router-dom";
import { Avatar, Box, Button, ButtonBase, ButtonGroup, Card, CardHeader, Container, IconButton, Menu, MenuItem, Modal, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
                                    <MoreVertIcon 
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    />
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
                                            <EditIcon />
                                            <Link to={`/profile/addresses/edit-address/${addr.idAddress}`}>Editar</Link>
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>
                                            <DeleteIcon />
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