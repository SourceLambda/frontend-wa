import { Link } from "react-router-dom"

const Header = ({profile}) => {

    return (
        <header>
            <ul>
				<li>
					<Link to={"/"}>
						Inicio
					</Link>
				</li>
				<li>
					<Link to={"/products"}>
						Productos
					</Link>
				</li>
				<li>
					<Link to={"/new-product"}>
						Nuevo Producto
					</Link>
				</li>
				<li>
					<Link to={"/profile"}>
						{profile.firstname || "Iniciar Sesión"}
					</Link>
				</li>
			</ul>
        </header>
    )
}

export default Header