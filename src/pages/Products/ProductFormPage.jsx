import React, { useContext } from 'react';
import ProductForm from '../../components/ProductForm';
import { ProductContext } from '../../App';

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


function ProductFormPage({ fetchedCategories, dataType }) {

	const { selectedProduct } = useContext(ProductContext)

	let postData;
	if (dataType === 'create') {
		postData = {
			post: DEFAULT_POST,
			description: DEFAULT_DESC,
			techDetails: [],
			otherDetails: [],
			dataType
		}
	}
	else if (dataType === 'update') {

		const DATA_DESC = {
			Description_text: selectedProduct.Description.Description_text,
			Brand: selectedProduct.Description.Brand
		}
		const DATA_POST = {
			ID: selectedProduct.ID,
			Title: selectedProduct.Title,
			CategoryID: selectedProduct.CategoryID,
			Image: selectedProduct.Image,
			Creation_date: DEFAULT_POST.Creation_date,
			Units: selectedProduct.Units,
			Price: selectedProduct.Price
		}

		postData = {
			post: DATA_POST,
			description: DATA_DESC,
			techDetails: selectedProduct.Description.Tech_details,
			otherDetails: selectedProduct.Description.Other_details,
			dataType
		}
	}
	
	return (
		<ProductForm data={postData} fetchedCategories={fetchedCategories} />
	)
}

export default ProductFormPage