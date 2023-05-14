import React, { useState, useEffect } from "react"
import { getBillsQuery } from "../../util/postMSQueries";
import GraphQLQuery from "../../util/graphQLQuery"

const DEFAULT_BILLS =[ {
    idCliente: "loading...",
    total: 0,
    date: "loading...",
    user: "loading...",
    state: "loading...",
    products: [
        {
            name: "loading...",
            description: "loading...",
            price: 0,
            quantity: 0
        }
    ]
}
]

const BillHistory = () => {
    const [bills, setBills] = useState(DEFAULT_BILLS)
    useEffect(() => {

        const query = getBillsQuery();

         async function getBills () {
    
			const response = await GraphQLQuery(query)

			// apigateway have no response from ms
			const jsonRes = await response.json()

			if (jsonRes.data === null || jsonRes.errors) {
			 	return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes.errors[0]});
			}
			setBills(jsonRes.data.historyByClientId)

        }
        getBills()
          .catch((err) => {console.log(err)})

    }, [])
    return (
        <><div>
            <h1>Historial de Compras</h1>
        </div><div>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Estado</th>
                            <th>Productos</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => (
                            <tr>
                                <td>{bill.date}</td>
                                <td>{bill.user}</td>
                                <td>{bill.state}</td>
                                <td>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Descripción</th>
                                                <th>Precio</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bill.products.map((product) => (
                                                <tr>
                                                    <td>{product.name}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                                <td>{bill.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div></>

    )
}

export default  BillHistory