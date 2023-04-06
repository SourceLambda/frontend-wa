import React, { useState } from "react"
import { uploadFile } from "../assets/firebase"

// https://firebase.google.com/docs/storage/web/delete-files?hl=es

const DEFAULT_DESC = {
	Description_text:"",
	Brand:"",
}

const DEFAULT_POST = {
	Title: "",
	CategoryID: 0,
	Description: DEFAULT_DESC,
	Creation_date: new Date().toISOString().split('T')[0],
	Units: 0,
	Price: 0
}

function PostPage() {
	
	const [post, setPost] = useState(DEFAULT_POST)
	const [description, setDescription] = useState(DEFAULT_DESC)
	const [file, setFile] = useState(null)

	const categories = [
		{categoryName:'Tecnologia', categoryID:1},
		{categoryName:'Moda', categoryID:2},
		{categoryName:'Industrial', categoryID:3},
		{categoryName:'Hogar', categoryID:4}
	]

	const handlePostValue = (e) => {
		e.preventDefault()

		setPost({...post, [e.target.name]: e.target.value})
	}

	const handleDescValue = (e) => {
		e.preventDefault()

		setDescription({...description, [e.target.name]: e.target.value})
	}

	const createPost = async (e) => {
		e.preventDefault(e)

		if (file == null) {
			alert("Es necesario ingresar una imagen del producto.")
			return
		}

		try {	
			const imageUrl = await uploadFile(file)

			const query = `
				mutation {
					createPost(post: {
						Title: "${post.Title}"
						CategoryID: ${post.CategoryID}
						Image: "${imageUrl}"
						Description: {
							Description_text: "${description.Description_text}"
							Brand: "${description.Brand}"
						}
						Creation_date: "${post.Creation_date}"
						Units: ${post.Units}
						Price: ${post.Price}
					})
				}
			`;

			await fetch("http://localhost:5000/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify({
					query,
				}),
			})
			.then(async response => {
				// const isJson = response.headers.get('Content-Type')?.includes('application/json');
				// const data = isJson ? await response.json() : null;
		  
				// // check for error response
				// if (!response.ok) {
				// 	// get error message from body or default to response status
				// 	const error = (data && data.message) || response.status;
				// 	return Promise.reject(error);
				// }
				return await response.json();
			})
			.then((response) => console.log(response.data))
		}
		catch (err) {
			console.log(err)
		}
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
							categories.map(category => <option key={category.categoryID} value={category.categoryID}>{category.categoryName}</option>)
						}
                    </select>
				</div>
				<div className="form-input">
					<label htmlFor="image-input">Imagen</label><br/>
					<input id="image-input" name="Image" type="file" accept="images/*" onChange={(e) => {setFile(e.target.files[0])}}></input>
					<div className="product-image">
						<img src={file ? URL.createObjectURL(file) : ""} alt="Carga una imagen del producto" width='200px' />
					</div>
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
				</fieldset>
				<div className="form-input">
					<label htmlFor="units-input">Unidades</label><br/>
					<input id="units-input" name="Units" type="number" min={1} step={1} onChange={handlePostValue}></input>
				</div>
				<div className="form-input">
					<label htmlFor="price-input">Precio</label><br/>
					<input id="price-input" name="Price" type="number" min={1} step='any' onChange={handlePostValue}></input>
				</div>
				<button type="submit">Publicar Producto</button>
			</form>
		</div>
	)
}

export default PostPage