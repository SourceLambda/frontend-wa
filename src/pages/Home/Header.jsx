import { AppBar, CssBaseline, GlobalStyles, Toolbar, Typography, Link as StyleLink } from '@mui/material'
import { Link } from 'react-router-dom'

const Header = ({profile}) => {

	const adminView = () => {
		return (
			<>
				<StyleLink component={Link} to="/new-product" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
					Nuevo Producto
				</StyleLink>
				<StyleLink component={Link} to="/profile" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
					{profile.firstname || "ADMIN"}
				</StyleLink>
			</>
		)
	}

	const clientView = () => {
		return(
			<>
				<StyleLink component={Link} to="/" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
					Carrito
				</StyleLink>
				<StyleLink component={Link} to="/bill-history" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
					Historial de Compras
				</StyleLink>
				<StyleLink component={Link} to="/profile" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
					{profile.firstname || "CLIENT"}
				</StyleLink>
			</>
		)
	}

	const defaultUserView = () => {
		return (
			<>
				<StyleLink component={Link} to="/login" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
					Iniciar Sesión
				</StyleLink>
				<StyleLink component={Link} to="/register" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
					Registrarse
				</StyleLink>
			</>
		)
	}

    return (
        <>
			<GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
			<CssBaseline />
			<AppBar position="relative">
				<Toolbar sx={{flexGrap: 'wrap'}}>
					
					<Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>SourceLambda</Typography>
					<nav>
						<StyleLink component={Link} to='/' variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
							Inicio
						</StyleLink>
						<StyleLink component={Link} to="/products" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
							Productos
						</StyleLink>
						{(localStorage.getItem('user-role') === 'admin' && adminView()) 
							|| (localStorage.getItem('user-role') === 'client' && clientView()) 
							|| (defaultUserView())}
					</nav>
				</Toolbar>
			</AppBar>
        </>
    )
}

export default Header