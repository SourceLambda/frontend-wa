import { AppBar, CssBaseline, GlobalStyles, Toolbar, Typography, Link as StyleLink } from '@mui/material'

const Header = ({profile}) => {

    return (
        <>
			<GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
			<CssBaseline />
			<AppBar position="relative">
				<Toolbar sx={{flexGrap: 'wrap'}}>
					
					<Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>SourceLambda</Typography>
					<nav>
						<StyleLink variant="button" href="/" sx={{ my: 1, mx: 1.5, color: 'white' }}>
							Inicio
						</StyleLink>
						<StyleLink variant="button" href="/products" sx={{ my: 1, mx: 1.5, color: 'white' }}>
							Productos
						</StyleLink>
						<StyleLink variant="button" href="/new-product" sx={{ my: 1, mx: 1.5, color: 'white' }}>
							Nuevo Producto
						</StyleLink>
						<StyleLink variant="button" href="/profile" sx={{ my: 1, mx: 1.5, color: 'white' }}>
							{profile.firstname || "Iniciar Sesión"}
						</StyleLink>
					</nav>
				</Toolbar>
			</AppBar>
        </>
    )
}

export default Header