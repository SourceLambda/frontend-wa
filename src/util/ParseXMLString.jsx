const parseXMLResponse = (xml) => {
    
    const EnvelopeMatch = xml.match(/(<SOAP-ENV:Envelope .*><SOAP-ENV:Body>(<ns2:getVenuesResponse ([^>]*)>(.*)<\/ns2:getVenuesResponse>)<\/SOAP-ENV:Body><\/SOAP-ENV:Envelope>)/)
    const VenueMatch = EnvelopeMatch[4].match(/<ns2:venue>([\s\S]*?)<\/ns2:venue>/g);

    const gamesInfo = VenueMatch.map((gameInfo) => {
        const infoArray = gameInfo.match(/<ns2:venue><ns2:description>(.*)<\/ns2:description><ns2:id>(.*)<\/ns2:id><ns2:isActive>(.*)<\/ns2:isActive><ns2:location>(.*)<\/ns2:location><\/ns2:venue>/)
        return {gameID: Number(infoArray[2]), description: infoArray[1], state: (infoArray[3] === 'true'), address: infoArray[4]}
    });

    return gamesInfo
}

export default parseXMLResponse;