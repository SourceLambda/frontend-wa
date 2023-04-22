import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductFormPage, ProductInfoPage, ProductsPage } from './pages/Products/index'
import { HomePage, Header, Footer } from './pages/Home'
import errorImage from './assets/luffy_eating.webp'
import { getProfileById } from './util/profileMSQueries'

import { Profile, ProfileAddresses, ProfileCards, ProfilePage, ProfileForm} from './pages/Profile';
import { BillHistory, CreateBill } from './pages/Bills';

const ProductContext = createContext(null)

function App() {

	const [selectedProduct, setSelectedProduct] = useState(null)
	const [profile, setProfile] = useState({});

    // useEffect(() => {
    //     const query = getProfileById(88);
    //     const getProfile = async() => {
    //         const res = await GraphQLQuery(query);
    //         const jsonRes = await res.json();

	// 		if (jsonRes.data === null || jsonRes.errors) {
	// 		 	return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
	// 		}
            
    //         setProfile(jsonRes.data.profileById);

    //     }
    //     getProfile();
        
    // }, []);
	
	return (
		<ProductContext.Provider value={{selectedProduct, setSelectedProduct}}>
			<Router>
				<Header profile={profile}/>
				<Routes>
					<Route path="/" element={<HomePage/>}></Route>
					<Route path="/products" element={<ProductsPage/>}></Route>
					<Route path="/products/:id" element={<ProductInfoPage/>}></Route>
					<Route path="/new-product" element={<ProductFormPage dataType={'create'}/>}></Route>
					<Route path="/edit-product" element={<ProductFormPage dataType={'update'}/>}></Route>
					<Route path="/*" element={<div><h2>Error 404</h2><img src={errorImage} width='300px'></img><p>Not found :v</p></div>}></Route>
					<Route path="/bill-history" element={<BillHistory/>}></Route>
					<Route path="/bill-payment" element={<CreateBill/>}></Route>
					<Route path='/profile' element={<Profile profile={profile}/>}/>
					<Route path='/profile/profilepage' element={<ProfilePage profile={profile}/>}/>
					<Route path='/profile/profilepage/edit' element={<ProfileForm profile={profile}/>}/>
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