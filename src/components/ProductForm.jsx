import { useEffect, useState } from "react"
import { imageReference, uploadFile, deleteFile, imageNameReference } from "../util/firebase"
import GraphQLQuery from "../util/graphQLQuery"
import { productMutation } from "../util/postMSQueries"
import { createCategoryTree } from "../util/CategoryTreeClass"

function ProductForm({ data, fetchedCategories }) {
	
    // post/product data, can be default data or some data to edit 
	const [post, setPost] = useState(data.post)
	const [description, setDescription] = useState(data.description)
	const [techDetail, setTechDetail] = useState("")
	const [techDetails, setTechDetails] = useState(data.techDetails)
	const [otherDetail, setOtherDetail] = useState("")
	const [otherDetails, setOtherDetails] = useState(data.otherDetails)

    // file and imageFirebaseRef are related to firebase storage and must be managed different
	const [file, setFile] = useState(null)
	const [imageFirebaseRef, setImageFirebaseRef] = useState(undefined)

    // categories depend on categories fetched at page start
	const [categories, setCategories] = useState([]);
	const [categoryString, setCategoryString] = useState("");
	const [categoryTree, setCategoryTree] = useState(null)

	useEffect(() => {

        const catTree = createCategoryTree(fetchedCategories)

        setCategoryTree(catTree)
        setCategories(catTree.getChildrenCategories(0))

    }, [fetchedCategories])

	const handlePostValue = (e) => {
		e.preventDefault()

		setPost({...post, [e.target.name]: e.target.value})
	}

	const handleDescValue = (e) => {
		e.preventDefault()

		setDescription({...description, [e.target.name]: e.target.value})
	}

	const handleImageUpload = (e) => {
		setFile(e.target.files[0])
		setImageFirebaseRef(imageReference(e.target.files[0]))
	}

	const handleSelectCategory = (e) => {
		e.preventDefault()
		
		const selectedCatID = Number(e.target.value)
		const selectedCategory = categories.find(category => category.ID === selectedCatID)
		
		setPost({...post, CategoryID: selectedCatID})
		setCategoryString(categoryString ? `${categoryString} -> ${selectedCategory.Name}` : selectedCategory.Name)
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
				...post,
				imageURL,
				description,
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

			setTechDetails([...techDetails, techDetail])
			setTechDetail("")
		}
		if (type === "OTHER") {

			setOtherDetails(otherDetails.concat(otherDetail))
			setOtherDetail("")
		}
	}

	const handleDeleteDetail = (e, value, type) => {
		e.preventDefault()

		if (type === "TECH") setTechDetails(techDetails.filter(detail => detail != value))
		if (type === "OTHER") setOtherDetails(otherDetails.filter(detail => detail != value))
	}

	const detailsList = (details, type) => {
	
		return (
			<ul>
				{details.map(detail => {
					return <div key={detail}>
						<li>{detail}	<button onClick={(e) => {
							e.preventDefault()
							handleDeleteDetail(e, detail, type)
						}}>Borrar</button></li>
					</div>
				})}
			</ul>
		)
	}
	
	return (
		<div>
			<h2>{data.dataType === 'create' ? "Nuevo Producto" : "Editar Producto"}</h2>
			<form onSubmit={createPost}>
				<div className="form-input">
					<label htmlFor="title-input">Nombre del Producto</label><br/>
					<input id="title-input" name="Title" value={post.Title} onChange={handlePostValue}></input>
				</div>
				<div className="form-input">
					<label htmlFor="category-input">Categoria</label><br/>
					<select id="category-input" name="CategoryID" onChange={handleSelectCategory}>
                        <option defaultValue>Choose...</option>
                        {
							categories.map(category => <option key={category.ID} value={category.ID}>{category.Name}</option>)
						}
                    </select>
					<div className="drop-down-category">
						Categoria: {categoryString}<button disabled={categoryString === ""} onClick={(e) => {
							e.preventDefault()

							setCategoryString("")
							setCategories(categoryTree.getChildrenCategories(0))
						}}>Limpiar</button>
					</div>
				</div>
				<fieldset>
					<legend>Descripción</legend>
					<div className="form-description">
						<label htmlFor="description-input">Texto breve</label><br/>
						<input id="description-input" name="Description_text" value={description.Description_text} onChange={handleDescValue}></input>
					</div>
					<div className="form-description">
						<label htmlFor="brand-input">Marca</label><br/>
						<input id="brand-input" name="Brand" value={description.Brand} onChange={handleDescValue}></input>
					</div>
					<div className="form-description">
						<label htmlFor="brand-input">Detalles Técnicos</label><br/>
						{techDetails.length ? detailsList(techDetails, "TECH") : null}
						<input id="brand-input" value={techDetail} onChange={(e) => {setTechDetail(e.target.value)}}></input>
						<button onClick={(e) => {
							e.preventDefault()
							handlerDetail(e, "TECH")
						}}>Añadir</button>
					</div>
					<div className="form-description">
						<label htmlFor="brand-input">Otros Detalles</label><br/>
						{otherDetails.length ? detailsList(otherDetails, "OTHER") : null}
						<input id="brand-input" value={otherDetail} onChange={(e) => {setOtherDetail(e.target.value)}}></input>
						<button onClick={(e) => {
							e.preventDefault()
							handlerDetail(e, "OTHER")
						}}>Añadir</button>
					</div>
				</fieldset>
				<div className="form-input">
					<label htmlFor="units-input">Unidades</label><br/>
					<input id="units-input" name="Units" type="number" min={1} step={1} value={post.Units} onChange={handlePostValue}></input>
				</div>
				<div className="form-input">
					<label htmlFor="price-input">Precio</label><br/>
					<input id="price-input" name="Price" type="number" min={1} step='any' value={post.Price} onChange={handlePostValue}></input>
				</div>
				<div className="form-input">
					<label htmlFor="image-input">Imagen</label><br/>
					<input id="image-input" name="Image" type="file" accept="image/png, image/webp, image/jpeg" onChange={handleImageUpload}></input>
					<div className="product-image">
						<img src={file ? URL.createObjectURL(file) : ""} alt="Carga una imagen del producto" width='200px' />
					</div>
				</div>
				<button type="submit">Publicar Producto</button>
			</form>
		</div>
	)
}

export default ProductForm