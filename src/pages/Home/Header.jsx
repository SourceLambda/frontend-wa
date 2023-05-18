import { AppBar, CssBaseline, GlobalStyles, Toolbar, Typography, Link as StyleLink } from '@mui/material'
import { Link } from 'react-router-dom'

const toolBarStyle = {
    backgroundColor: '#1a1f24',
	flexGrap: 'wrap'
};

const buttonStyle = {
    color: '#ec4e20', // naranja
	my: 1, 
	mx: 1.5,
};

const Header = ({profile}) => {

	const adminView = () => {
		return (
			<>
				<StyleLink component={Link} to="/new-product" variant="button" sx={buttonStyle}>
					Nuevo Producto
				</StyleLink>
				<StyleLink component={Link} to="/profile" variant="button" sx={buttonStyle}>
					{profile.firstname || "ADMIN"}
				</StyleLink>
			</>
		)
	}

	const clientView = () => {
		return(
			<>
				<StyleLink component={Link} to="/shopping-cart" variant="button" sx={buttonStyle}>
					Carrito
				</StyleLink>
				<StyleLink component={Link} to="/bill-history" variant="button" sx={buttonStyle}>
					Historial de Compras
				</StyleLink>
				<StyleLink component={Link} to="/profile" variant="button" sx={buttonStyle}>
					{profile.firstname || "CLIENT"}
				</StyleLink>
			</>
		)
	}

	const defaultUserView = () => {
		return (
			<>
				<StyleLink component={Link} to="/login" variant="button" sx={{...buttonStyle, p: '8px', border: '2px solid white', borderRadius: '8px', color: 'white'}}>
					Iniciar Sesión
				</StyleLink>
				<StyleLink component={Link} to="/register" variant="button" sx={buttonStyle}>
					Registrarse
				</StyleLink>
			</>
		)
	}

	// NARANJA

    return (
        <>
			<GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
			<CssBaseline />
			<AppBar position="relative">
				<Toolbar sx={toolBarStyle}>
					
					<Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>SourceLambda</Typography>
					<nav>
						<StyleLink component={Link} to='/' variant="button" sx={buttonStyle}>
							Inicio
						</StyleLink>
						<StyleLink component={Link} to="/products" variant="button" sx={buttonStyle}>
							Productos
						</StyleLink>
						{(localStorage.getItem('user-role') === 'admin' && adminView()) 
							|| (localStorage.getItem('user-role') === 'customer' && clientView()) 
							|| (defaultUserView())}
					</nav>
				</Toolbar>
			</AppBar>
        </>
    )
}

export default Header