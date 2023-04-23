import { useEffect, useState } from "react";
import { getAddressesByProfile } from "../../util/profileMSQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import { Link, Route } from "react-router-dom";
import { Avatar, Button, ButtonGroup, Card, CardHeader, Container, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProfileAddresses = ({profile}) => {
    const [addresses, setAddresses] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
    
    return(
        <Container>
            <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                {'Mis Direcciones'}
            </Typography>
            {addresses.map(addr => {
                return( 
                    <>
                    <br />
                    <Card sx={{ maxWidth: 500 }}>
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
                                            Eliminar
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
            <Button variant="contained" size="large">
                Agregar Dirección
            </Button>
        </Container>
    );
}

export default ProfileAddresses;