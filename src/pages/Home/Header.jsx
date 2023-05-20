import { AppBar, CssBaseline, GlobalStyles, Toolbar, Typography, Link as StyleLink, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import SourceLambdaLogo from '../../assets/sl_logo.png'

const toolBarStyle = {
    // backgroundColor: '#1a1f24',
	flexGrap: 'wrap'
};

const buttonStyle = {
    //color: '#ec4e20', // naranja
	color: 'primary.secondary',
	my: 1, 
	mx: 1.5,
};

const AdminLinks = ({ username }) => {
	return (
		<>
			<StyleLink component={Link} to="/new-product" variant="button" sx={buttonStyle}>
				Nuevo Producto
			</StyleLink>
			<StyleLink component={Link} to="/profile" variant="button" sx={buttonStyle}>
				{username || "ADMIN"}
			</StyleLink>
		</>
	)
}

const ClientLinks = ({ username }) => {
	return(
		<>
			<StyleLink component={Link} to="/shopping-cart" variant="button" sx={buttonStyle}>
				Carrito
			</StyleLink>
			<StyleLink component={Link} to="/bill-history" variant="button" sx={buttonStyle}>
				Historial de Compras
			</StyleLink>
			<StyleLink component={Link} to="/profile" variant="button" sx={buttonStyle}>
				{username || "CLIENT"}
			</StyleLink>
		</>
	)
}

const DefaultUserLinks = () => {
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

const Header = ({profile}) => {

    return (
        <>
			<GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
			<CssBaseline />
			<AppBar position="relative">
				<Toolbar sx={toolBarStyle}>
					<StyleLink sx={{ flexGrow: 1 }} component={Link} to='/' variant="button">
						<Box >
							<img style={{float: 'left', verticalAlign: 'center'}} src={SourceLambdaLogo} width='50px'></img>
							<Typography variant="h6" color='white' ><i>SourceLambda</i></Typography>
						</Box>
					</StyleLink>
					
					<nav>
						
						<StyleLink component={Link} to="/products" variant="button" sx={buttonStyle}>
							Productos
						</StyleLink>
						{(localStorage.getItem('user-role') === 'admin' && <AdminLinks username={profile.firstname} />) 
							|| (localStorage.getItem('user-role') === 'customer' && <ClientLinks username={profile.firstname} />) 
							|| <DefaultUserLinks />}
					</nav>
				</Toolbar>
			</AppBar>
        </>
    )
}

export default Header