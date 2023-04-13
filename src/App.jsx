import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import { NewProductPage, ProductInfoPage, ProductsPage } from './pages/Products/index'
import Header from '../src/pages/Home/Header'
import Footer from '../src/pages/Home/Footer'
import errorImage from './assets/luffy_eating.webp'

function App() {
	
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<HomePage/>}></Route>
				<Route path="/products/:id" element={<ProductInfoPage/>}></Route>
				<Route path="/products" element={<ProductsPage/>}></Route>
				<Route path="/new-product" element={<NewProductPage/>}></Route>
				<Route path="/*" element={<div><h2>Error 404</h2><img src={errorImage} width='300px'></img><p>Not found :v</p></div>}></Route>
			</Routes>
			<Footer />
		</Router>
	)
}

export default App