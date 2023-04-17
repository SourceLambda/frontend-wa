import { useContext, useEffect, useState } from "react";
import { getProductsQuery } from "../../util/postMSQueries";
import { useSearchParams } from "react-router-dom";
import GraphQLQuery from "../../util/graphQLQuery";
import { ProductContext } from "../../App";
import { Link, Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";

const ProductsPage = () => {
    
    const [products, setProducts] = useState([])
    const [searchParams] = useSearchParams()
    const { setSelectedProduct } = useContext(ProductContext)
    
    useEffect(() => {

        const query = getProductsQuery(searchParams.get('page'), searchParams.get('category'));

        async function getProducts () {
    
			const response = await GraphQLQuery(query)

			// apigateway have no response from ms
			const jsonRes = await response.json()
			if (jsonRes.data === null || jsonRes.errors) {
			 	return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
			}

			setProducts(jsonRes.data.allPosts)

        }
        getProducts()
            .catch((err) => {console.log(err)})

    }, [])

    return (
        <Container sx={{ py: 8 }} maxWidth='md' >
            <Grid container spacing={4}>
                {products.map((prod) => 
                <Grid item key={prod.ID} xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }} >
                        <CardMedia
                            component='img'
                            image={prod.Image}
                            alt={prod.Title + " Image"}
                            sx={{align: 'bottom'}}
                        />
                        <CardContent
                            sx={{ height: 'min-content' }}
                        >
                            <Typography gutterBottom variant="h5" component="h2" >
                                <Link href={`/products/${prod.ID}`} onClick={() => setSelectedProduct(prod)}>{prod.Title}</Link>
                            </Typography>
                            <Typography variant="h6">{prod.Description.Brand}</Typography>
                            <Typography>Precio: ${prod.Price}</Typography>
                            <Typography>Rating: {(prod.Sum_ratings / prod.Num_ratings) || prod.Num_ratings}</Typography>
                            <Typography>{prod.Description.Description_text}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
            </Grid>
        </Container>
    )
}

export default ProductsPage