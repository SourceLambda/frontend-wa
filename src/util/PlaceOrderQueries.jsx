

//el id del cliente se debe obtener del local storage
export function getBillsQuery() {
    return `
    query {
        historyByClientId(idCliente: 101){
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
export function createBill(billTemplate) {
    return `
    mutation {
        createBill(BillTemplate:${billTemplate}){
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
