import React, { useState, useEffect, useContext } from 'react';
import { ProductForm } from "../../components"
import { ProductContext } from '../../App';
import { getCategoriesQuery } from '../../util/postMSQueries'
import GraphQLQuery from '../../util/graphQLQuery'

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

function ProductFormPage({ dataType }) {

	const { selectedProduct } = useContext(ProductContext)
	const [categories, setCategories] = useState([])

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
		<ProductForm data={postData} fetchedCategories={categories} />
	)
}

export default ProductFormPage