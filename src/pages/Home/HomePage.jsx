import React from "react"
import { Typography } from '@mui/material'

import logoImage from '../../assets/sl_logo.png'
import githubImage from '../../assets/github.png'
import './App.css';

function HomePage() {
	
	return (
		<>
			<Typography variant="h1" align='center' sx={{my: 3}} fontSize={50}>SourceLambda - Tienda Online</Typography>	
			<div class="container header-section flex">
                <div class="header-left">
					<Typography variant="h2" align='center' sx={{my: 3}} fontSize={35}>La mejor solución de <i>E-commerce</i></Typography>
                    <p>
						El sistema de software SourceLambda es un marketplace inspirado en la página de compras de Falabella, que se conforma por los siguientes módulos:
					</p>
					<ul>
						<li># Autentificación</li>
						<li># Gestión de usuarios</li>
						<li># Catálogo de productos</li>
						<li># Buscador</li>
						<li># Servicio de carrito de compras</li>
						<li># Pasarela de pagos</li>
					</ul>
                </div>
                <div class="header-right">
                    <img src={logoImage} alt="sourcelambda_logo" />
                </div>
            </div>

			<div class="container second-div header-section flex">
				<div class="header-right github-image">
                    <img src={githubImage} alt="sourcelambda_logo" />
                </div>
                <div class="header-left">
					<Typography variant="h2" align='center' sx={{my: 3}} fontSize={35}>Conoce nuestro código abierto en <i>GitHub</i></Typography>
                    <p>
						Aquí podrás encontrar los repositorios de nuestros componentes utilizados para la creación del sistema:
					</p>
					<a href="https://github.com/SourceLambda">SourceLambda</a>
				</div>
            </div>
		</>
	)
}

export default HomePage