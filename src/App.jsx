import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage, Header, Footer } from './pages/Home'
import errorImage from './assets/image_error_404.jpg'
import { getProfileById } from './util/profileMSQueries'
import GraphQLQuery from './util/graphQLQuery'

import { ProductFormPage, ProductInfoPage, ProductsPage } from './pages/Products'
import { BillHistory, CreateBill } from './pages/Bills';
import { LoginPage, RegisterPage, RecoveryPage } from './pages/Auth'
import ShowCart from './pages/Cart/shopping-cart'
import { Profile, ProfileAddresses, ProfileCards, ProfilePage, ProfileForm } from './pages/Profile';
import { AddressForm, CardForm } from './components'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
	palette: {
		primary: {
			main: '#000000',
			secondary: '#ec4e20',
			textPrimary: '#95a1ac',
			textSecondary: '#dbe2e7',
		},
		secondary: {
			main: '#ec4e20',
		}
	},
	// aqui se especifica la fuente, se convierte a array la prop de css:
	// font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	// typography: {
	// 	fontFamily: [
	// 		'Impact', 
	// 		'Haettenschweiler', 
	// 		'"Arial Narrow Bold"', 
	// 		'sans-serif',
	// 	].join(',')
	// }
});

const AppContext = createContext(null)

function App() {
	
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [profile, setProfile] = useState({});
	
	useEffect(() => {// actualizar con el localStorage guardando el idProfile uuid
		const getProfile = async() => {
			const query = getProfileById(localStorage.getItem('user-id'));
			
			const res = await GraphQLQuery(query);
			const jsonRes = await res.json();
			
			if (jsonRes.data === null || jsonRes.errors) {
				return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
			}
			
			setProfile(jsonRes.data.profileById);
		}
		localStorage.getItem('user-id') && getProfile();
		
	}, []);
	
	return (
		<AppContext.Provider value={{
			selectedProduct, 
			setSelectedProduct, 
			profile
		}}>
		<ThemeProvider theme={theme}>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<HomePage/>}></Route>
					<Route path="/login" element={<LoginPage/>}></Route>
					<Route path="/register" element={<RegisterPage/>}></Route>
					<Route path="/recovery" element={<RecoveryPage/>}></Route>
					
					<Route path="/products" element={<ProductsPage/>}></Route>
					<Route path="/products/:id" element={<ProductInfoPage/>}></Route>
					<Route path="/new-product" element={<ProductFormPage dataType={'create'}/>}></Route>
					<Route path="/edit-product" element={<ProductFormPage dataType={'update'}/>}></Route>
					
					<Route path="/bill-history" element={<BillHistory/>}></Route>
					<Route path="/bill-payment" element={<CreateBill/>}></Route>
					<Route path="/shopping-cart" element={<ShowCart/>}></Route>
					
					<Route path='/profile' element={<Profile profile={profile}/>}/>
					<Route path='/profile/profilepage' element={<ProfilePage profile={profile}/>}/>
					<Route path='/profile/profilepage/edit' element={<ProfileForm profile={profile}/>}/> {/* este no */}
					<Route path='/profile/addresses' element={<ProfileAddresses profile={profile}/>}/> {/* pasar id en vez de objeto */}
					<Route path='/profile/addresses/new' element={<AddressForm idProfile={profile.idProfile} />} />
					<Route path='/profile/addresses/edit-address/:id' element={<AddressForm idProfile={profile.idProfile} />}/>
					<Route path='/profile/cards' element={<ProfileCards profile={profile}/>}/> {/* pasar id en vez de objeto */}
					<Route path='/profile/cards/new' element={<CardForm idProfile={profile.idProfile}/>}/>
					
					<Route path="/*" element={<div><h2>Error 404</h2><img src={errorImage} width='300px'></img><p>Not found</p></div>}></Route>
				</Routes>
				<Footer />
			</Router>
		</ThemeProvider>
		</AppContext.Provider>
		)
	}
	
	export { AppContext, App }