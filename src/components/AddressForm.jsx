import { useLocation, useParams } from "react-router";
import { createAddressToProfile, getAddressFromProfileAddresses, updateAddress } from "../util/profileMSQueries";
import { useEffect, useState } from "react";
import GraphQLQuery from "../util/graphQLQuery";
import { Box, Button, Container, Modal, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const AddressForm = ({idProfile}) => {
    const params = useParams();
    const [address, setAddresses] = useState([]);

    const [addr, setAddr] = useState("");
    const [detailAddr, setDetailAddr] = useState("");

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [error, setError] = useState([]);

    const location = useLocation();

    useEffect(() => {
        
        const query = getAddressFromProfileAddresses(idProfile, params.id);
        const getAddress = async() => {
            const res = await GraphQLQuery(query);
            const jsonRes = await res.json();

            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }
            setAddresses(jsonRes.data.addressFromProfileAddresses);
            setAddr(jsonRes.data.addressFromProfileAddresses.address);
            setDetailAddr(jsonRes.data.addressFromProfileAddresses.detailAddress);
        }
        getAddress();
    }, []);

    const handleForm = async (event) => {
         event.preventDefault();

         var query;

         if(location.pathname === '/profile/addresses/new'){
            const createAddress = {
                address: addr,
                detailAddress: detailAddr
             }
    
            query =  createAddressToProfile(idProfile, createAddress);
         }else {
            const updatedAddress = {
                address: addr,
                detailAddress: detailAddr
             }
    
            query =  updateAddress(params.id, updatedAddress);
         }
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
                { location.pathname === '/profile/addresses/new' ? 'Nueva Dirección':'Editar Dirección'}
            </Typography>
            <Box 
                component="form"
                sx={{   
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            > 
                <TextField id="addr" onChange={(e) => {setAddr(e.target.value)}} label="Dirección" value={addr}  />            
                <TextField id="detail_addr" onChange={(e) => {setDetailAddr(e.target.value)}} label="Detalles de la Dirección" value={detailAddr}  />            
                
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
                            {error != null ? 'Dirección actualizada': 'Dirección modificada exitosamente en tu cuenta.'}
                        </Typography>
                        <br />
                        <Link to={'/profile/addresses'}>
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

export default AddressForm;