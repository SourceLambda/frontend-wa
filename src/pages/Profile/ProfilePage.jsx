import { Link } from "react-router-dom";

const ProfilePage = ({profile}) => {
    return(
        <div>
            <h1>Mis Datos</h1>
            <h3>Datos Personales</h3>
            <Link to={'/profile/profilepage/edit'}><p>Editar</p></Link>
            <p>Nombre: {profile.firstname + profile.lastname}</p>
            <p>Correo: {profile.email}</p>
            <p>Telefono: {profile.telNumber}</p>
            <p>Fecha de Nacimiento: {profile.birthday}</p>
            
        </div>
    );
}

export default ProfilePage;