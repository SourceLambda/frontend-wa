import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductFormPage, ProductInfoPage, ProductsPage } from './pages/Products/index'
import HomePage from './pages/Home/HomePage'
import Header from './pages/Home/Header'
import Footer from './pages/Home/Footer'
import errorImage from './assets/luffy_eating.webp'
import { getCategoriesQuery } from './util/postMSQueries'
import { getProfileById } from './util/profileMSQueries'
import GraphQLQuery from './util/graphQLQuery'

import { Profile, ProfileAddresses, ProfileCards, ProfileForm } from './pages/Profile';

const ProductContext = createContext(null)

function App() {

	const [categories, setCategories] = useState([])
	const [selectedProduct, setSelectedProduct] = useState(null)

/* 
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
    }, []) */

	const [profile, setProfile] = useState(null);

    useEffect(() => {
        const query = getProfileById(88);
        const getProfile = async() => {
            const res = await GraphQLQuery(query);
            const jsonRes = await res.json();

            console.log(jsonRes.data.profileById);

			if (jsonRes.data === null || jsonRes.errors) {
			 	return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
			}
            
            setProfile(jsonRes.data.profileById);

        }
        getProfile();
        
    }, []);
	
	return (
		<ProductContext.Provider value={{selectedProduct, setSelectedProduct}}>
			<Router>
				<Header profile={profile}/>
				<Routes>
					<Route path="/" element={<HomePage/>}></Route>
					<Route path="/products" element={<ProductsPage/>}></Route>
					<Route path="/products/:id" element={<ProductInfoPage/>}></Route>
					<Route path="/new-product" element={<ProductFormPage fetchedCategories={categories} dataType={'create'}/>}></Route>
					<Route path="/edit-product" element={<ProductFormPage fetchedCategories={categories} dataType={'update'}/>}></Route>
					<Route path="/*" element={<div><h2>Error 404</h2><img src={errorImage} width='300px'></img><p>Not found :v</p></div>}></Route>

					<Route path='/profile' element={<Profile profile={profile}/>}/>
					<Route path='/profile/edit' element={<ProfileForm profile={profile}/>}/>
					<Route path='/profile/addresses' element={<ProfileAddresses profile={profile}/>}/>
					<Route path='/profile/cards' element={<ProfileCards profile={profile}/>}/>
				</Routes>
				<Footer />
			</Router>
		</ProductContext.Provider>
/* 		<ProfileContext.Provider value={{Profile, setProfile}}>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<HomePage/>}></Route>
					<Route path='/profile' element={<Profile />}/>
				</Routes>
			</Router>
		</ProfileContext.Provider> */
	)
}

export { ProductContext, App }