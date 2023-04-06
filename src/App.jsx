import React from 'react'
import {
	BrowserRouter as Router,
	Routes, Route
} from 'react-router-dom'
import HomePage from './pages/HomePage'
import FormPost from './pages/FormPost'

function App() {
	
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage/>}></Route>
				<Route path="/post/create" element={<FormPost/>}></Route>
			</Routes>
		</Router>
		)
	}
	
	export default App