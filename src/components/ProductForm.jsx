import { useEffect, useRef, useState } from "react"
import { Box, Button, CardMedia, Container, FormControl, Grid, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select, TextField, Typography } from "@mui/material"
import { imageReference, uploadFile, deleteFile, imageNameReference } from "../util/firebase"
import GraphQLQuery from "../util/graphQLQuery"
import { productMutation } from "../util/postMSQueries"
import { createCategoryTree } from "../util/CategoryTreeClass"
import { json, useNavigate } from "react-router-dom"
import SnackBarNotification from "./SnackBarNotification"
import { indexProductQuery } from "../util/browserQueries"

function ProductForm({ data, fetchedCategories }) {
	
    // post/product data, can be default data or some data to edit
	const titleInput = useRef()
	const descTextInput = useRef()
	const brandInput = useRef()
	const techDetailInput = useRef()
	const otherDetailInput = useRef()
	const unitsInput = useRef()
	const priceInput = useRef()

	const [techDetails, setTechDetails] = useState(data.techDetails)
	const [otherDetails, setOtherDetails] = useState(data.otherDetails)
	const [category, setCategory] = useState(data.post.CategoryID)

    // file and imageFirebaseRef are related to firebase storage and must be managed different
	const [file, setFile] = useState(null)
	const [imageFirebaseRef, setImageFirebaseRef] = useState(undefined)

    // categories depend on categories fetched at page start
	const [categories, setCategories] = useState([]);
	const [categoryString, setCategoryString] = useState("");
	const [categoryTree, setCategoryTree] = useState(null)

	// snackbar default information
	const [snackBarInfo, setSnackBarInfo] = useState({
		message: "", 
		barType: "info", 
		state: false, 
		time: 3000,
		redirectHandler: () => {}
	})

	// validation object
	const [invalid, setInvalid] = useState({
        title: false,
		categoryValid: false,
		descText: false,
		brand: false,
		techDetail: false,
		otherDetail: false,
		units: false,
		price: false
    });

	// react router hook to page redirect
	const navigate = useNavigate();

	useEffect(() => {

        const catTree = createCategoryTree(fetchedCategories)

        setCategoryTree(catTree)
        setCategories(catTree.getChildrenCategories(0))
		setCategoryString(catTree.getCategoryByID(data.post.CategoryID)?.Name || '')

    }, [fetchedCategories])

	const handleImageUpload = (e) => {
		setFile(e.target.files[0])
		setImageFirebaseRef(imageReference(e.target.files[0]))
	}

	const handleSelectCategory = (e) => {
		e.preventDefault()
		
		const selectedCatID = Number(e.target.value)
		const selectedCategory = categories.find(category => category.ID === selectedCatID)
		
		setCategory(selectedCatID)
		setCategoryString(categoryString ? `${categoryString} > ${selectedCategory.Name}` : selectedCategory.Name)
		setCategories(categoryTree.getChildrenCategories(selectedCatID))
	}

	const createPost = async (e) => {
		e.preventDefault(e)

		if (file === null && data.dataType === 'create') {
			alert("Es necesario ingresar una imagen del producto.")
			return
		}

		// form validation
        const invalidTitle = !/^([\w ]{10,})$/.test(titleInput.current.value);
		const invalidCategory = category < 1;
        const invalidDescText = !/^([\w ]{10,})$/.test(descTextInput.current.value);
		const invalidBrand = !/^([\w ]+)$/.test(brandInput.current.value);
		const invalidTechDet = techDetails.some(detail => !/^([\w ]+)$/.test(detail));
		const invalidOtherDet = otherDetails.some(detail => !/^([\w ]+)$/.test(detail));
		const invalidUnits = unitsInput.current.value < 1;
		const invalidPrice = priceInput.current.value <= 0;
        setInvalid({
            title: invalidTitle,
			categoryValid: invalidCategory,
			descText: invalidDescText,
			brand: invalidBrand,
			techDetail: invalidTechDet,
			otherDetail: invalidOtherDet,
			units: invalidUnits,
			price: invalidPrice
        })
        if (
		[
			invalidTitle,
			invalidCategory,
			invalidDescText,
			invalidBrand,
			invalidTechDet,
			invalidOtherDet,
			invalidUnits,
			invalidPrice
		].includes(true)) {
            return
        }

		try {
			// if there is an image loaded then must upload it
			let imageURL = data.post.Image;
			if (file !== null) {
				imageURL = await uploadFile(file, imageFirebaseRef)
			}
			// also if the mutation case is 'update' must delete the old image
			if (file !== null && data.dataType === 'update') {
				const imgRef = imageNameReference(data.post.Image.match(/images%2F[\w-]+.(png|jpeg|webp)/)[0].replace("%2F", "/"))
				deleteFile(imgRef)
			}

			const postData = {
				Title: titleInput.current.value,
				CategoryID: category,
				Creation_date: data.post.Creation_date,
				Units: unitsInput.current.value,
				Price: priceInput.current.value,
				imageURL,
				description: {
					Description_text: descTextInput.current.value,
					Brand: brandInput.current.value
				},
				techDetails,
				otherDetails
			}
			const newProductQuery = productMutation(data.post.ID, postData, data.dataType)
			
			const newProductResponse = await GraphQLQuery(newProductQuery);
			const jsonResNewProduct = await newProductResponse.json()
			
			// apigateway have no response from ms in createPost query
			if (jsonResNewProduct.data === null || jsonResNewProduct.errors) {
			 	return Promise.reject({msg: "Error from ApiGateway", error: jsonResNewProduct.errors[0]});
			}

			const indexProdQuery = indexProductQuery({
				ID: data.post.ID || jsonResNewProduct.data.createPost,
				Title: titleInput.current.value,
				Description: descTextInput.current.value,
				Category: categoryTree.getCategoryByID(category).Name,
			})
			const indexProdResponse = await GraphQLQuery(indexProdQuery);
			const jsonResIndexProd = await indexProdResponse.json();

			// apigateway have no response from ms in indexProduct query
			if (jsonResIndexProd.data === null || jsonResIndexProd.errors) {
			 	return Promise.reject({msg: "Error from ApiGateway", error: jsonResIndexProd.errors[0]});
			}

			setSnackBarInfo({
				message: data.dataType === 'create' ? 'Producto creado exitosamente' : 'Producto actualizado exitosamente', 
				barType: 'success', 
				state: true, 
				time: 3000,
				redirectHandler: () => navigate('/products')
			})
			//console.log(jsonRes.data)
		}
		catch (err) {
			await deleteFile(imageFirebaseRef)
			setSnackBarInfo({
				message: 'Error al crear/modificar el Producto', 
				barType: 'error', 
				state: true, 
				time: 3000,
				redirectHandler: () => {}
			})
			//console.log(err)
		}
	}

	const handlerDetail = (e, type) => {
		e.preventDefault()
	
		if (type === "TECH") {

			setTechDetails([...techDetails, techDetailInput.current.value])
			techDetailInput.current.value = '';
		}
		if (type === "OTHER") {

			setOtherDetails(otherDetails.concat(otherDetailInput.current.value))
			otherDetailInput.current.value = '';
		}
	}

	const handleDeleteDetail = (e, value, type) => {
		e.preventDefault()

		if (type === "TECH") setTechDetails(techDetails.filter(detail => detail != value))
		if (type === "OTHER") setOtherDetails(otherDetails.filter(detail => detail != value))
	}
	
	return (
		<>
			<Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
					<Typography variant="h4" gutterBottom >
						{data.dataType === 'create' ? "Nuevo Producto" : "Editar Producto"}
					</Typography>
					<Grid container sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}} spacing={3} >
						<Grid item >
							<TextField
								required
								id="titleProd"
								inputRef={titleInput}
								defaultValue={data.post.Title}
								error={invalid.title}
                            	helperText={(invalid.title) && 'Ingresa un texto válido.'}
								name="Title"
								label="Título del Producto"
								fullWidth
								variant="standard"
							/>
						</Grid>
						<Grid item  >
							<FormControl>
								<InputLabel id="category-select-label">Categoría</InputLabel>
								<Select
									labelId="category-select-label"
									id="category-select"
									name="CategoryID"
									onChange={handleSelectCategory}
									value={''}
									label="Categoría"
									error={invalid.categoryValid}
									sx={{ width: '200px' }}
								>
									{
										categories.map(category => <MenuItem key={category.ID} value={category.ID}>{category.Name}</MenuItem>)
									}
								</Select>
							</FormControl>
							<Typography variant='h6' >
								Categoria: {categoryString}
								<Button variant="contained" color='secondary' component="label" disabled={categoryString === ""} onClick={(e) => {
									e.preventDefault()

									setCategoryString("")
									setCategories(categoryTree.getChildrenCategories(0))
								}} >Limpiar</Button>
							</Typography>
						</Grid>
						<Grid item >
							<fieldset>
								<legend>Descripción</legend>
								<Grid container sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}} spacing={3} >
									<Grid item >
										<TextField
											required
											id="Description_text"
											name="Description_text"
											inputRef={descTextInput}
											defaultValue={data.description.Description_text}
											error={invalid.descText}
                            				helperText={(invalid.descText) && 'Ingresa un texto válido.'}
											label="Breve Descripción"
											fullWidth
											multiline
											rows={4}
											variant="outlined"
										/>
									</Grid>
									<Grid item >
										<TextField
											required
											id="Brand"
											name="Brand"
											inputRef={brandInput}
											defaultValue={data.description.Brand}
											error={invalid.brand}
                            				helperText={(invalid.brand) && 'Ingresa un texto válido.'}
											label="Marca"
											variant="standard"
										/>
									</Grid>
									<Grid item >
										<Typography variant="h6" component="div">{/* REFACTORIZAR ESTE COMP */}
											Detalles Técnicos
										</Typography>
										<Box sx={{ width: 'min-content' }} >
											<List dense={false} >
												<ListItem sx={{display: 'flex', flexDirection: 'column', width: 'max-content'}} >
													{techDetails.map(detail => {
														return <Box key={detail} sx={{display: 'flex', flexDirection: 'row'}}>
															<ListItemText primary={detail} />
															<Button 
																variant='outlined' 
																onClick={(e) => {
																	e.preventDefault()
																	handleDeleteDetail(e, detail, 'TECH')
																}}
																color='secondary'
															>Borrar</Button>
														</Box>
													})}
												</ListItem>
											</List>
											<Box sx={{display: 'flex', flexDirection: 'row'}} >
												<TextField
													required
													id="TechDetail"
													name="TechDetail"
													inputRef={techDetailInput}
													defaultValue={data.techDetails}
													error={invalid.techDetail}
                            						helperText={(invalid.techDetail) && 'Ingresa un texto válido.'}
													label="Nuevo"
													variant="outlined"
													sx={{width: '200px'}}
												/>
												<Button
													variant="outlined"
													onClick={(e) => {
														e.preventDefault()
														handlerDetail(e, "TECH")
													}}
													color='secondary'
												>+</Button>
											</Box>
										</Box>
									</Grid>
									<Grid item >
										<Typography variant="h6" component="div">
											Otros Detalles
										</Typography>
										<Box sx={{ width: 'min-content' }} >
											<List dense={false} >
												<ListItem sx={{display: 'flex', flexDirection: 'column', width: 'max-content'}} >
													{otherDetails.map(detail => {
														return <Box key={detail} sx={{display: 'flex', flexDirection: 'row'}}>
															<ListItemText primary={detail} />
															<Button 
																variant='outlined' 
																onClick={(e) => {
																	e.preventDefault()
																	handleDeleteDetail(e, detail, 'OTHER')
																}}
																color='secondary'
															>Borrar</Button>
														</Box>
													})}
												</ListItem>
											</List>
											<Box sx={{display: 'flex', flexDirection: 'row'}} >
												<TextField
													required
													id="OtherDetail"
													name="OtherDetail"
													inputRef={otherDetailInput}
													defaultValue={data.otherDetails}
													error={invalid.otherDetail}
                            						helperText={(invalid.otherDetail) && 'Ingresa un texto válido.'}
													label="Nuevo"
													variant="outlined"
													sx={{width: '200px'}}
												/>
												<Button
													variant="outlined"
													onClick={(e) => {
														e.preventDefault()
														handlerDetail(e, "OTHER")
													}}
													color='secondary'
												>+</Button>
											</Box>
										</Box>
									</Grid>
								</Grid>        
							</fieldset>
						</Grid>
						<Grid item >
							<TextField
								required
								id="Units"
								name="Units"
								label="Unidades"
								type='number'
								inputRef={unitsInput}
								defaultValue={data.post.Units}
								error={invalid.units}
                            	helperText={(invalid.units) && 'Ingresa una cantidad válida.'}
								variant="outlined"
								inputProps={{ inputMode: 'numeric', step: 1, min: 1 }}
							/>
						</Grid>
						<Grid item >
							<TextField
								required
								id="Price"
								name="Price"
								label="Precio"
								type='number'
								inputRef={priceInput}
								defaultValue={data.post.Price}
								error={invalid.price}
                            	helperText={(invalid.price) && 'Ingresa un precio válido.'}
								variant="outlined"
								inputProps={{ inputMode: 'numeric', step: 'any' }}
							/>
						</Grid>
						<Grid item >
							<CardMedia
								component='img'
								image={file ? URL.createObjectURL(file) : ""}
								alt="Carga una imagen del producto"
								sx={{width: '200px'}}
							/>
							<Button variant="outlined" color='secondary' component="label" >
								Subir Imagen
								<input
									type="file"
									name="Image"
									accept="image/png, image/webp, image/jpeg"
									onChange={handleImageUpload}
									hidden
								/>
							</Button>
						</Grid>
						<Grid item >
							<Button variant="contained" color='secondary' onClick={createPost} >Publicar Producto</Button>
						</Grid>
					</Grid>
				</Paper>
			</Container>
			<SnackBarNotification sncBarData={snackBarInfo} />
		</>
	)
}

export default ProductForm