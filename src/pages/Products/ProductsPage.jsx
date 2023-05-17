import { useContext, useEffect, useState } from "react";
import { getCategoriesQuery, getCountProducts, getProductsQuery } from "../../util/postMSQueries";
import { Link, useSearchParams } from "react-router-dom";
import GraphQLQuery from "../../util/graphQLQuery";
import { ProductContext } from "../../App";
import { Link as StyleLink, Card, CardContent, CardMedia, Container, Grid, Typography, Pagination, List, ListItemButton, ListItemText, ListSubheader, InputBase } from "@mui/material";
import { createCategoryTree } from "../../util/CategoryTreeClass";
import { SearchComp } from "../../components";

const ProductsPage = () => {
    
    const [products, setProducts] = useState([])
    const [countProds, setCountProds] = useState(0)
    const [searchParams] = useSearchParams()
    const [categoryTree, setCategoryTree] = useState(null)

    const { setSelectedProduct } = useContext(ProductContext)
    
    useEffect(() => {

        const queryGetProds = getProductsQuery(searchParams.get('page'), searchParams.get('category'));
        const queryCountProds = getCountProducts();
        const queryGetCategories = getCategoriesQuery();

        async function getProductsInfo () {
    
            const [responseProds, responseCountProds, responseCategories] = await Promise.all([
                GraphQLQuery(queryGetProds),
                GraphQLQuery(queryCountProds),
                GraphQLQuery(queryGetCategories)
            ])
			
            // apigateway have no response from ms
            const [jsonProdsRes, jsonCountProdsRes, jsonCategories] = await Promise.all([
                responseProds.json(),
                responseCountProds.json(),
                responseCategories.json()
            ])

			if (jsonProdsRes.data === null || jsonProdsRes.errors) {
			 	return Promise.reject({msg: "Error response from ApiGateway", error: jsonProdsRes?.errors[0]});
			}
            if (jsonCountProdsRes.data === null || jsonCountProdsRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonCountProdsRes?.errors[0]});
            }
            if (jsonCategories.data === null || jsonCategories.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonCategories?.errors[0]});
            }

			setProducts(jsonProdsRes.data.allPosts)
            setCountProds(jsonCountProdsRes.data.countAllPost)

            const catTree = createCategoryTree(jsonCategories.data.allCategories)
            setCategoryTree(catTree)
        }
        getProductsInfo()
            .catch((err) => {console.log(err)})

    }, [])

    const listItemCategories = (categories) => {

        return categories.map(category => <Container key={category.ID} >
            <ListItemButton onClick={() => window.location.assign(`/products?category=${category.ID}`)} >
                <ListItemText primary={category.Name} />
            </ListItemButton>
            {listItemCategories(categoryTree.getChildrenCategories(category.ID))}
        </Container>
        )
    }

    // <SearchIconWrapper>
    //                 <SearchIcon />
    //                 </SearchIconWrapper>

    return (
        <Grid container component='main' sx={{ py: 3, pb: '0px' }} >
            <Grid item md={3} >
                <List 
                    component="nav"
                    subheader={
                        <ListSubheader component="div">
                            Selecciona la Categoría
                        </ListSubheader>
                    }
                >
                    {
                        categoryTree && listItemCategories(categoryTree.getChildrenCategories(0))
                    }
                </List>
            </Grid>
            <Grid item md={9} sx={{ pr: '10px' }} >
                <Grid item md={12} >
                    <SearchComp />
                </Grid>
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
                                    <StyleLink component={Link} to={`/products/${prod.ID}`} onClick={() => setSelectedProduct(prod)}>{prod.Title}</StyleLink>
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
            </Grid>

            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: '50px' }}
            >
                <Grid item xs={3}>
                    <Pagination 
                        count={Math.trunc(countProds / 20) + 1} 
                        shape='rounded' 
                        size='large' 
                        page={Number(searchParams.get('page')) || 1}
                        onChange={(e, value) => {
                            const productsURLRegex = window.location.href.match(/\?category=[1-9]\d*/)
                            if (productsURLRegex) {
                                return window.location.assign(`${productsURLRegex}&page=${value}`)
                            }
                            return window.location.assign(`/products?page=${value}`)
                        }}
                    />
                </Grid>
            </Grid> 
            
        </Grid>
    )
}

export default ProductsPage