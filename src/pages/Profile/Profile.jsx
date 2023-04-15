import { useContext, useEffect, useState } from "react";
import { getProfileById } from "../../util/profileMSQueries";
import { Link, json } from "react-router-dom";
import GraphQLQuery from "../../util/graphQLQuery";

const Profile = ({profile}) => {

    return(
        <div>
            <h1>{profile.firstname + " " + profile.lastname}</h1>
            <p>Información de tu perfil</p>

            <div>
                <Link to={'/profile/profilepage'}>
                    <h3>Mis Datos</h3>
                </Link>
                <p>Datos validos</p>

                <Link to={'/profile/addresses'}>
                    <h3>Direcciones</h3>
                </Link>
                <p>Direcciones guardadas en tu cuenta</p>

                <Link to={'/profile/cards'}>
                    <h3>Tarjetas</h3>
                </Link>
                <p>Tarjetas guardadas en tu cuenta</p>
            </div>
        </div>
    );
}

export default Profile;