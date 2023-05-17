import { Box, InputBase } from "@mui/material";
import { useRef } from "react";

// best ally for new frontend devs = border: '2px solid #f00' 

const SearchComp = () => {

    const otherDetailInput = useRef();

    const pressEnterHandler = async (e) => {
        e.preventDefault();

        console.log("se presiono enter xd")
        console.log(e.key)
    }
    
    return (
        <Box sx={{ 
            width: '230px', 
            height: '50px', 
            float: 'right', 
            display: 'flex', 
            borderRadius: '10px', 
            border: '2px solid black',
            borderColor: '#1976d2'
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, ml: 2, float: 'left' }} >
                <Box sx={{ width: '30px', height: '30px' }} >
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
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