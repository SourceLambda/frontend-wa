export function getProfileById(id_profile){
    return `
    query {
        profileById(id: ${id_profile}) {
            idProfile
            firstname
            lastname
            telNumber
            email
            password
            birthday
            alternativeNumber
            role
        }
    }
    `;
}

export function getAddressesByProfile(id_profile){
    return `
    query {
        addressessByProfileId(id_profile: ${id_profile}){
          idAddress
          address
          detailAddress
        }
      }
    `;
}

export function getAddressFromProfileAddresses(id_profile, id_address){
    return `
    query {
        addressFromProfileAddresses(id_profile: ${id_profile}, id_address: ${id_address}){
          idAddress
          address
          detailAddress
        }
      }
    `;
}

export function getCardsByProfile(id_profile){
    return `
    query {
        cardsByProfileId(id_profile: ${id_profile}){
          idCard
          cardNumber
          cardNickname
        }
      }
    `;
}

export function getCardFromProfileCards(id_profile, id_card){
    return `
    query {
        cardFromProfileCards(id_profile: ${id_profile}, id_card: ${id_card}){
          idCard
          cardNumber
          cardNickname
        }
      }
    `;
}

export function deleteAddress(id_profile, id_address){
    const query = `
    mutation {
        deleteAddress(id_profile: ${id_profile}, id_address: ${id_address})
      }
    `;
    
    return query;
}

export function deleteCard(id_profile, id_card){
    const query = `
    mutation {
        deleteCard(id_profile: ${id_profile}, id_card: ${id_card})
      }
    `;
    
    return query;
}

export function createCardToProfile(id_profile, card){
    const query = `
    mutation {
      createCardToProfile(id_profile: ${id_profile}, card: {
        cardName: "${card.cardName}", 
        expirationDate: "${card.expirationDate}", 
        cardNickname: "${card.cardNickname}", 
        cvv: ${card.cvv}, 
        cardNumber: ${card.cardNumber}
      }){
        cardNickname
      }
    }
    `;
    
    return query;
}

export function createAddressToProfile(id_profile, addr){
    const {address, detailAddress} = addr
    const query = `
    mutation {
      createAddressToProfile(id_profile: ${id_profile}, address: {
        address: "${address}",
        detailAddress: "${detailAddress}"
      }){
        idAddress
        address
        detailAddress
      }
    }
    `;
    
    return query;
}


export function updateAddress(id_address, addr){

    const {address, detailAddress} = addr

    const query = `
    mutation {
        updateProfileAddress(id_address: ${id_address}, address: {
          address: "${address}",
          detailAddress: "${detailAddress}"
        }) {
          idAddress
          address
          detailAddress
        }
      }
      
    `;
    
    return query;
}


export function updateProfile(id_profile, profile){
    const {idProfile, firstname, lastname, telNumber, email, password, birthday, alternativeNumber, role} = profile;

    const query = `
    mutation {
        updateProfile(id_profile: ${id_profile}, profile: {
          idProfile: ${idProfile},
          firstname: "${firstname}",
          lastname: "${lastname}",
          telNumber: ${telNumber},
          email: "${email}",
          password: "${password}",
          birthday: "${birthday}",
          alternativeNumber: ${alternativeNumber},
          role: "${role}"
        }){
          firstname
          lastname
          email
        }
      }
      
    `;
    
    return query;
}

