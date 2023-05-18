

//el id del cliente se debe obtener del local storage

export function getBillsQuery(userId="903aa2d8-cb59-11ed-afa1-0242ac120002") {
    return `
    query {
        historyByClientId(idCliente:"${userId}") {
            idCliente
            total
            date
            user
            state
            products{
                name
                price
                quantity
            }
        }
    }
    `;
}
export function createBill(userId="903aa2d8-cb59-11ed-afa1-0242ac120002") {
    return `
    mutation {
        createBill(idCliente:${userId}){
            idCliente
            total
            date
            user
            state
            products{
                name
                description
                price
                quantity
            }
        }
    }
            `;
    }

export function Allbills() {
    return `
    query {
        allBills {
            total
            date
            user
            state
            products{
                name
                price
                quantity
            }
        }
    }
            `;
    }