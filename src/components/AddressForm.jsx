import { useParams } from "react-router";
import { getAddressFromProfileAddresses } from "../util/profileMSQueries";
import { useEffect, useState } from "react";
import GraphQLQuery from "../util/graphQLQuery";

const AddressForm = ({idProfile}) => {
    const params = useParams();
    const [address, setAddresses] = useState([]);
    
    useEffect(() => {
        
        const query = getAddressFromProfileAddresses(idProfile, params.id);
        const getAddress = async() => {
            const res = await GraphQLQuery(query);
            const jsonRes = await res.json();

            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }
            setAddresses(jsonRes.data.addressFromProfileAddresses);
        }
        getAddress();
    }, []);

    return(
        <div>
            <h1>{address.address}</h1>
            
        </div>
    );
}

export default AddressForm;