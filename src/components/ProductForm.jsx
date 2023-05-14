import { useEffect, useRef, useState } from "react"
import { Alert, Box, Button, CardMedia, Container, FormControl, Grid, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select, Snackbar, TextField, Typography } from "@mui/material"
import { imageReference, uploadFile, deleteFile, imageNameReference } from "../util/firebase"
import GraphQLQuery from "../util/graphQLQuery"
import { productMutation } from "../util/postMSQueries"
import { createCategoryTree } from "../util/CategoryTreeClass"
import { useNavigate } from "react-router-dom"

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
	const [openSnackbar, setOpenSnackbar] = useState(false)

    // file and imageFirebaseRef are related to firebase storage and must be managed different
	const [file, setFile] = useState(null)
	const [imageFirebaseRef, setImageFirebaseRef] = useState(undefined)

    // categories depend on categories fetched at page start
	const [categories, setCategories] = useState([]);
	const [categoryString, setCategoryString] = useState("");
	const [categoryTree, setCategoryTree] = useState(null)

	// react router hook to page redirect
	const navigate = useNavigate();

	useEffect(() => {

        const catTree = createCategoryTree(fetchedCategories)

        setCategoryTree(catTree)
        setCategories(catTree.getChildrenCategories(0))

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

		if (file == null) {
			alert("Es necesario ingresar una imagen del producto.")
			return
		}

		try {
			
			const imageURL = await uploadFile(file, imageFirebaseRef)

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

			let query;
			if (data.dataType === 'create') {
				query = productMutation(null, postData, 'create')
			}
			else {
				// se puede cambiar ahora que SE TIENE EL IMG LINK
				const imgRef = imageNameReference(data.post.Image.match(/images%2F[\w-]+.(png|jpeg|webp)/)[0].replace("%2F", "/"))
				deleteFile(imgRef)
				query = productMutation(data.post.ID, postData, 'update')
			}

			const response = await GraphQLQuery(query)

			// apigateway have no response from ms
			const jsonRes = await response.json()

			if (jsonRes.data === null || jsonRes.errors) {
			 	return Promise.reject({msg: "Error from ApiGateway", error: jsonRes.errors[0]});
			}

			setOpenSnackbar(true)
			console.log(jsonRes.data)
		}
		catch (err) {
			/*const dltRes = */await deleteFile(imageFirebaseRef)
			console.log(err)
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
								// value={post.Title}
								// onChange={handlePostValue}
								inputRef={titleInput}
								defaultValue={data.post.Title}
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
									sx={{ width: '200px' }}
								>
									{
										categories.map(category => <MenuItem key={category.ID} value={category.ID}>{category.Name}</MenuItem>)
									}
								</Select>
							</FormControl>
							<Typography variant='h6' >
								Categoria: {categoryString}
								<Button variant="contained" component="label" disabled={categoryString === ""} onClick={(e) => {
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
								inputRef={unitsInput}
								defaultValue={data.post.Units}
								variant="outlined"
								inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
							/>
						</Grid>
						<Grid item >
							<TextField
								required
								id="Price"
								name="Price"
								label="Precio"
								inputRef={priceInput}
								defaultValue={data.post.Price}
								variant="outlined"
								inputProps={{ inputMode: 'numeric', pattern: '[0-9]*.[0-9]*' }}
							/>
						</Grid>
						<Grid item >
							<CardMedia
								component='img'
								image={file ? URL.createObjectURL(file) : ""}
								alt="Carga una imagen del producto"
								sx={{width: '200px'}}
							/>
							<Button variant="outlined" component="label" >
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
							<Button variant="contained" onClick={createPost} >Publicar Producto</Button>
						</Grid>
					</Grid>
				</Paper>
			</Container>
			<Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => navigate('/products') }>
				<Alert severity="success" variant='filled' sx={{ width: '100%' }}>
					{data.dataType === 'create' ? 'Producto creado correctamente' : 'Producto actualizado correctamente'}
				</Alert>
			</Snackbar>
		</>
	)
}

export default ProductForm