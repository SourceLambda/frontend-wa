import { AppBar, CssBaseline, GlobalStyles, Toolbar, Typography, Link as StyleLink } from '@mui/material'
import { Link } from 'react-router-dom'
import SourceLambdaLogo from '../../assets/sl_logo.png'
import { useContext } from 'react';
import { AppContext } from '../../App';

import './App.css';
import FootballBanner from './FootballBanner';

const toolBarStyle = {
    backgroundColor: '#1a1f24', // si se quiere dejar el header negro, comentar esta linea
	flexGrap: 'wrap',
	display: 'flex', 
	justifyContent: 'space-between', 
	flexDirection: 'row' 
};

const buttonStyle = {
	my: 1, 
	mx: 1.5,
};

const AdminLinks = ({ username }) => {
	return (
		<>
			<StyleLink component={Link} to="/new-product" variant="button" color='secondary' sx={buttonStyle}>
				Nuevo Producto
			</StyleLink>
			<StyleLink component={Link} to="/profile" variant="button" color='secondary' sx={buttonStyle}>
				{username || "ADMIN"}
			</StyleLink>
		</>
	)
}

const ClientLinks = ({ username }) => {
	return(
		<>
			<StyleLink component={Link} to="/shopping-cart" variant="button" color='secondary' sx={buttonStyle}>
				Carrito
			</StyleLink>
			<StyleLink component={Link} to="/bill-history" variant="button" color='secondary' sx={buttonStyle}>
				Historial de Compras
			</StyleLink>
			<StyleLink component={Link} to="/profile" variant="button" color='secondary' sx={buttonStyle}>
				{username || "CLIENT"}
			</StyleLink>
		</>
	)
}

const DefaultUserLinks = () => {
	return (
		<>
			<StyleLink id='login-link' component={Link} to="/login" variant="button" sx={{
				...buttonStyle, 
				p: '8px', 
				border: '2px solid white', 
				borderRadius: '8px', 
				color: 'white', 
				textDecoration: 'none'
			}}>
				Iniciar Sesión
			</StyleLink>
			<StyleLink component={Link} to="/register" variant="button" color='secondary' sx={buttonStyle}>
				Registrarse
			</StyleLink>
		</>
	)
}

const Header = () => {

	const { profile } = useContext(AppContext)

    return (
        <>
			<GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
			<CssBaseline />
			<AppBar position="relative">
				<Toolbar sx={toolBarStyle}>
					<StyleLink sx={{ alignContent: 'center', display: 'flex' }} component={Link} to='/' variant="button">
						<img style={{ display: 'flex', borderRadius: '50%' }} src={SourceLambdaLogo} width='50px'></img>
						<Typography variant="h6" color='white' fontSize={25} sx={{ ml: 2, display: 'flex', alignItems: 'center', textTransform: 'none' }} ><i>SourceLambda</i></Typography>
					</StyleLink>
					<nav>
						<StyleLink component={Link} to="/products" variant="button" color='secondary' sx={buttonStyle}>
							Productos
						</StyleLink>
						{(profile?.role === 'Admin' && <AdminLinks username={profile?.firstname} />) 
							|| (profile?.role === 'Customer' && <ClientLinks username={profile?.firstname} />) 
							|| <DefaultUserLinks />}
					</nav>
				</Toolbar>
				<FootballBanner />				
			</AppBar>
        </>
    )
}

export default Header