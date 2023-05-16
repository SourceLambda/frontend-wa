import { useEffect, useState } from "react";
import { getAddressesByProfile } from "../../util/profileMSQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import { Link } from "react-router-dom";

const ProfileAddresses = ({profile}) => {
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const query = getAddressesByProfile(profile.idProfile);
        const getAddresses = async() => {
            const res = await GraphQLQuery(query);
            const jsonRes = await res.json();

            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }
            setAddresses(jsonRes.data.addressessByProfileId);
        }
        getAddresses();
    }, []);
    
    return(
        <div>
            <h1>Direcciones</h1>
            <Link>Añadir nueva dirección</Link>
            {addresses.map(addr => {
                return(
                    <div key={addr.idAddress}>
                        <h2>{addr.address}</h2>
                        <p>{addr.detailAddress}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default ProfileAddresses;