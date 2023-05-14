import { AppBar, CssBaseline, GlobalStyles, Toolbar, Typography, Link as StyleLink, Button } from '@mui/material'
import { Link } from 'react-router-dom'

const Header = ({profile}) => {

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
						{
							profile.role != 'customer' ? 
							<StyleLink component={Link} to="/new-product" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
								Nuevo Producto
							</StyleLink>
							:
							''
						}
						
						<StyleLink component={Link} to="/profile" variant="button" sx={{ my: 1, mx: 1.5, color: 'white' }}>
							{profile.firstname || "Iniciar Sesión"}
						</StyleLink>
					</nav>
				</Toolbar>
			</AppBar>
        </>
    )
}

export default Header