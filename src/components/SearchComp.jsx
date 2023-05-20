import { Box, InputBase } from "@mui/material";
import { useRef } from "react";
import { searchProductsQuery } from "../util/browserQueries";
import GraphQLQuery from "../util/graphQLQuery";

// best ally for new frontend devs = border: '2px solid #f00' 

const SearchComp = ({ setProductsHandler }) => {

    const otherDetailInput = useRef();
    
    const pressEnterHandler = async (e) => {
        e.preventDefault();

        if (e.target.value === '') return
        
        const query = searchProductsQuery(e.target.value);

        const response = await GraphQLQuery(query)
        const jsonRes = await response.json()
        
        // apigateway have no response from ms
        if (jsonRes.data === null || jsonRes.errors) {
             return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
        }

        setProductsHandler(jsonRes.data.browse)
    }
    
    return (
        <Box sx={{ 
            width: '230px', 
            height: '50px', 
            float: 'right', 
            display: 'flex', 
            borderRadius: '10px', 
            border: '2px solid black',
            borderColor: 'secundary'
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, ml: 2, float: 'left' }} >
                <Box sx={{ width: '30px', height: '30px' }} >
                    <svg viewBox="0,0,256,256" width="30px" height="30px" fillRule="nonzero"><g fill='primary' fillRule="nonzero" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" style={{mixBlendMode: 'normal'}}><g transform="scale(8.53333,8.53333)"><path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path></g></g></svg>
                </Box>
            </Box>
            <InputBase
                name="OtherDetail"
                inputRef={otherDetailInput}
                placeholder="Buscar..."
                sx={{width: '200px', float: 'right'}}
                onKeyDown={(e) => {if(e.key === 'Enter') return pressEnterHandler(e)}}
            />
        </Box>
    )
}

export default SearchComp;