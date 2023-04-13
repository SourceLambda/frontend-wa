import React, { useState, useEffect } from "react"
import { imageReference, uploadFile, deleteFile } from "../../assets/firebase"
import { createPostMutation, getCategoriesQuery } from "../../util/postMSQueries"
import GraphQLQuery from "../../util/graphQLQuery"

const DEFAULT_DESC = {
	Description_text:"",
	Brand:""
}

const DEFAULT_POST = {
	Title: "",
	CategoryID: 0,
	Creation_date: new Date().toISOString().split('T')[0],
	Units: 0,
	Price: 0
}

function NewProductPage() {
	
	const [post, setPost] = useState(DEFAULT_POST)
	const [description, setDescription] = useState(DEFAULT_DESC)
	const [techDetail, setTechDetail] = useState("")
	const [techDetails, setTechDetails] = useState([])
	const [otherDetail, setOtherDetail] = useState("")
	const [otherDetails, setOtherDetails] = useState([])
	const [file, setFile] = useState(null)
	const [imageFirebaseRef, setImageFirebaseRef] = useState(undefined)
	const [categories, setCategories] = useState([]);

	useEffect(() => {

        const query = getCategoriesQuery();

        async function getCategories () {
    
			const response = await GraphQLQuery(query)

			// apigateway have no response from ms
			const jsonRes = await response.json()

			if (jsonRes.data === null || jsonRes.errors) {
			 	return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
			}
			setCategories(jsonRes.data.allCategories)

        }
        getCategories()
            .catch((err) => {console.log(err)})
    }, [])

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

			const query = createPostMutation(postData)

			const response = await GraphQLQuery(query)

			// apigateway have no response from ms
			const jsonRes = await response.json()

			if (jsonRes.data === null || jsonRes.errors) {
			 	return Promise.reject({msg: "Error from ApiGateway", error: jsonRes.errors[0]});
			}
			console.log(jsonRes.data)
		}
		catch (err) {
			const dltRes = await deleteFile(imageFirebaseRef)
			console.log(dltRes)
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
						<li>{detail}	<button onClick={(e) => {handleDeleteDetail(e, detail, type)}}>Borrar</button></li>
					</div>
				})}
			</ul>
		)
	}
	
	return (
		<div>
			<h2>Nuevo post</h2>
			<form onSubmit={createPost}>
				<div className="form-input">
					<label htmlFor="title-input">Nombre del Producto</label><br/>
					<input id="title-input" name="Title" onChange={handlePostValue}></input>
				</div>
				<div className="form-input">
					<label htmlFor="category-input">Categoria</label><br/>
					<select id="category-input" name="CategoryID" onChange={handlePostValue}>
                        <option defaultValue>Choose...</option>
                        {
							categories.map(category => <option key={category.ID} value={category.ID}>{category.Name}</option>)
						}
                    </select>
				</div>
				<fieldset>
					<legend>Descripción</legend>
					<div className="form-description">
						<label htmlFor="description-input">Texto breve</label><br/>
						<input id="description-input" name="Description_text" onChange={handleDescValue}></input>
					</div>
					<div className="form-description">
						<label htmlFor="brand-input">Marca</label><br/>
						<input id="brand-input" name="Brand" onChange={handleDescValue}></input>
					</div>
					<div className="form-description">
						<label htmlFor="brand-input">Detalles Técnicos</label><br/>
						{techDetails.length ? detailsList(techDetails, "TECH") : null}
						<input id="brand-input" value={techDetail} onChange={(e) => {setTechDetail(e.target.value)}}></input>
						<button onClick={(e) => {handlerDetail(e, "TECH")}}>Añadir</button>
					</div>
					<div className="form-description">
						<label htmlFor="brand-input">Otros Detalles</label><br/>
						{otherDetails.length ? detailsList(otherDetails, "OTHER") : null}
						<input id="brand-input" value={otherDetail} onChange={(e) => {setOtherDetail(e.target.value)}}></input>
						<button onClick={(e) => {handlerDetail(e, "OTHER")}}>Añadir</button>
					</div>
				</fieldset>
				<div className="form-input">
					<label htmlFor="units-input">Unidades</label><br/>
					<input id="units-input" name="Units" type="number" min={1} step={1} onChange={handlePostValue}></input>
				</div>
				<div className="form-input">
					<label htmlFor="price-input">Precio</label><br/>
					<input id="price-input" name="Price" type="number" min={1} step='any' onChange={handlePostValue}></input>
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

export default NewProductPage