import { useState } from "react";
import { createUserQuery } from "../../util/authQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import { SnackBarNotification } from "../../components";

// refactor this component in UserForm and import it here
const RegisterPage = () => {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const [snackBarInfo, setSnackBarInfo] = useState({
        message: '',
        barType: 'info',
        time: 3000,
        state: false,
        redirectHandler: () => {}
    })

    const newUserHandler = async (e) => {
        e.preventDefault();

        try{
            const userData = {
                email,
                password: pass,
                role: 'client'
            }
            const query = createUserQuery(userData)

            const response = await GraphQLQuery(query);
            const json = await response.json();

            // error from apigateway
            if (!json.data === null || json.errors) {
                return Promise.reject({msg: "Error response from Api Gateway", error: json?.errors[0]})
            }

            setSnackBarInfo({
                message: 'Usuario registrado correctamente.',
                type: 'success',
                time: 1000,
                state: true,
                redirectHandler: () => window.location.assign('/login')
            })

        }
        catch (err) {
            console.log(err)
        }
    }
    
    return (
        <>
            <form>
                <h3>Nuevo Usuario</h3>
                <input id="email-input" onChange={(e)=>{setEmail(e.target.value)}} ></input>
                <label htmlFor="email-input"></label>
                <input id="password-input" type="password" onChange={(e)=>{setPass(e.target.value)}} ></input>
                <label htmlFor="password-input"></label>
                <button onClick={newUserHandler} >Registrarse</button>
            </form>
            <SnackBarNotification sncBarData={snackBarInfo} />
        </>
    )   
}

export default RegisterPage;