import { useEffect, useState } from "react"
import parseXMLResponse from "../../util/ParseXMLString";
import { Button } from "@mui/material";

const SOAP_CONSUME_URL = import.meta.env.VITE_SOAP_CONSUME_URL;

const FootballBanner = () => {

    const [gameLocations, setGameLocations] = useState([{
        gameID: -1,
        description: "Cargando información de UNTorneo...",
        state: false,
        address: ""
    }]);
    const [gameLocationDisplayed, setGameLocationDisplayed] = useState(0);

    useEffect(() => {

        (async () => {
            const response = await fetch(SOAP_CONSUME_URL)
            const xml2FText = await response.json()
            
            const gamesInfo = parseXMLResponse(xml2FText)
            setGameLocations(gamesInfo)
        })();
    }, [])

    return (
        <>
            <div style={{ height: '50px', backgroundColor: '#308ce9', display: 'flex', justifyContent: 'center' }} >
                <p style={{ display: 'flex' }}>
                    Canchas disponibles en <a href='#' style={{ paddingLeft: '4px', color: 'black' }}>UNTorneos</a>: 
                        {` ${gameLocations[gameLocationDisplayed].description} `}
                        - Lugar: {`${gameLocations[gameLocationDisplayed].address} `}
                        - Estado: <span style={{ color: gameLocations[gameLocationDisplayed].state ? '#3efd6e' : '#9b0303' }}>{
                            gameLocations[gameLocationDisplayed].state ? "Disponible" : "No Disponible"
                        }</span>
                        <Button variant="outlined" color='whiteColor' style={{ marginLeft: '15px'}} onClick={() => {
                            setGameLocationDisplayed((gameLocationDisplayed + 1) % gameLocations.length)
                        }}>{'>'}</Button>
                </p>
            </div>
        </>
    )
}

export default FootballBanner