import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ProductContext } from "../../App"
import { Review, ReviewForm, SnackBarNotification } from "../../components"
import Modal from '@mui/material/Modal';
import GraphQLQuery from "../../util/graphQLQuery"
import { deleteProdMutation, getProductQuery, getReviewsQuery } from "../../util/postMSQueries"
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { deleteFile, imageNameReference } from "../../util/firebase";

const DEFAULT_REVIEW = {
    User_name: localStorage.getItem('user-email')?.split('@')[0], // cambiar cuando se tenga la info del perfil
    User_email: localStorage.getItem('user-email'), 
    Rating: 1,
    Review_text: ""
}

const ProductInfoPage = () => {

    const { selectedProduct, setSelectedProduct } = useContext(ProductContext)
    const { id } = useParams('id')
    const [reviews, setReviews] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const [snackBarInfo, setSnackBarInfo] = useState({
        message: '', 
        barType: 'info', 
        state: false, 
        time: 3000,
        redirectHandler: () => {}
    })

    const navigate = useNavigate()
    
    const getProductRequest = async () => {
    
        try {
            const query = getProductQuery(id)
            const response = await GraphQLQuery(query)

            // apigateway have no response from ms
            const jsonRes = await response.json()
            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }

            return jsonRes.data.postById
        }
        catch (err) {
            return err
        }
    }

    const getReviewsRequest = async () => {
    
        try {
            const query = getReviewsQuery(null, id)
            const response = await GraphQLQuery(query)

            // apigateway have no response from ms
            const jsonRes = await response.json()
            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }

            return jsonRes.data.allReviews
        }
        catch (err) {
            return err
        }
    }

    useEffect(() => {
        if (!selectedProduct) {
            getProductRequest().then(res => {
                res.ID = id
                setSelectedProduct(res)
            }).catch((err) => console.log(err))
        }
        getReviewsRequest().then(res => {
            setReviews(res)
        }).catch((err) => console.log(err))
    }, [])

    const deleteProductRequest = async () => {

        if (!window.confirm('¿Está seguro de borrar este producto?')) {
            return
        }
        try {
            const query = deleteProdMutation(id)
            const response = await GraphQLQuery(query)

            // deleting the product image from firebase storage
            const imgRef = imageNameReference(selectedProduct.Image.match(/images%2F[\w-]+.(png|jpeg|webp)/)[0].replace("%2F", "/"))
			deleteFile(imgRef)

            // apigateway have no response from ms
            const jsonRes = await response.json()
            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }
            setSnackBarInfo({
				message: 'Producto eliminado correctamente', 
				barType: 'success', 
				state: true, 
				time: 3000,
				redirectHandler: () => navigate(`/products`)
			})
			//console.log(jsonRes.data)
		}
		catch (err) {
			await deleteFile(imageFirebaseRef)
			setSnackBarInfo({
				message: 'Error al eliminar producto', 
				barType: 'error', 
				state: true, 
				time: 3000,
				redirectHandler: () => {}
			})
        }
    }

    if (selectedProduct) {
        return (
            <>
                <Card sx={{ display: 'flex' }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography component="h2" variant="h5">
                            {selectedProduct.Title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {selectedProduct.Description.Brand}
                        </Typography>
                        <Typography variant="subtitle1" paragraph>
                            {selectedProduct.Description.Description_text}
                        </Typography>
                        <Box>
                            <Typography variant="subtitle1" paragraph>
                                Detalles Técnicos:
                            </Typography>
                            {selectedProduct.Description.Tech_details.map(detail => <li key={detail}>{detail}</li>)}
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" paragraph>
                                Otros Detalles:
                            </Typography>
                            {selectedProduct.Description.Other_details.map(detail => <li key={detail}>{detail}</li>)}
                        </Box>
                        <Typography variant="subtitle1">
                            Unidades: {selectedProduct.Units}
                        </Typography>
                        <Typography variant="subtitle1">
                            Precio: {selectedProduct.Price}
                        </Typography>
                        <Typography variant="subtitle1">
                            Rating: {(selectedProduct.Sum_ratings / selectedProduct.Num_ratings) || selectedProduct.Num_ratings}
                        </Typography>
                        {localStorage.getItem('user-role') === 'admin' ? 
                        (<Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }} >
                            <Button variant="outlined">
                                <Link to={"/edit-product"} style={{ textDecoration:'none', color:'blue' }}>Editar Producto</Link>
                            </Button>
                            <Button variant="outlined" color="error" onClick={deleteProductRequest}>Eliminar Producto</Button>
                        </Box>) : null}
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{ width: '350px', display: { xs: 'none', sm: 'block' } }}
                        image={selectedProduct.Image}
                        alt={selectedProduct.Title + " Image"}
                    />
                </Card>
                {localStorage.getItem('user-role') === 'customer' ? 
                    (<Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }} >
                        <Button sx={{m: '20px'}} variant="contained" onClick={() => {setModalOpen(true)}}>Crear Reseña</Button>
                        <Button sx={{m: '20px'}} variant="contained" onClick={() => {console.log('añadido xd')}}>Añadir al Carrito</Button>
                    </Box>) : null}

                <Grid container spacing={4} sx={{ m: '10px'}} >
                    {reviews.map(review => {
                        return <Grid item key={review.ID} xs={12} sm={6} md={4}>
                            <Review review={review} postID={id} />
                        </Grid>
                    })}
                </Grid>
                <Modal
                    open={modalOpen}
                    onClose={() => {setModalOpen(false)}}
                    children={<div><ReviewForm reviewData={DEFAULT_REVIEW} postID={id} dataType={'create'} /></div>}
                ></Modal>
                <SnackBarNotification sncBarData={snackBarInfo} />
            </>
        )
    }
    return (
        <div>Cargando</div>
    )
}

export default ProductInfoPage