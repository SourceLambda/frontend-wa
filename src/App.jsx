import React from 'react'
import {
	BrowserRouter as Router,
	Routes, Route
} from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import NewProductPage from './pages/Products/NewProductPage'
import FormPost from './pages/Home/HomePage'
import Header from '../src/pages/Home/Header'
import Footer from '../src/pages/Home/Footer'
import errorImage from './assets/luffy_eating.webp'
import BillHistory from './pages/Bills/bill-history'

function App() {
	
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<HomePage/>}></Route>
				<Route path="/products/:id" element={<FormPost/>}></Route>
				<Route path="/products" element={<FormPost/>}></Route>
				<Route path="/new-product" element={<NewProductPage/>}></Route>
				<Route path="/bill-history" element={<BillHistory/>}></Route>
				<Route path="/*" element={<div><h2>Error 404</h2><img src={errorImage} width='300px'></img><p>Not found :v</p></div>}></Route>
			</Routes>
			<Footer />
		</Router>
		)
	}
	
	export default App