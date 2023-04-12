import { Link } from "react-router-dom"

const Header = () => {

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
			</ul>
        </header>
    )
}

export default Header