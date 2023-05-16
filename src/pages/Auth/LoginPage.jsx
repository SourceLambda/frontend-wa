import { useState } from "react";
import { loginUserQuery } from "../../util/authQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import { SnackBarNotification } from "../../components";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';



const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    //Was correct!
    const [snackBarInfo, setSnackBarInfo] = useState({
        message: '',
        barType: 'info',
        time: 3000,
        state: false,
        redirectHandler: () => {}
    })

    const loginHandler = async (e) => {
        e.preventDefault();

        try{
            const userData = {
                email,
                password: pass,
            }
            const query = loginUserQuery(userData)

            const response = await GraphQLQuery(query);
            const json = await response.json();

            // error from apigateway
            if (!json.data === null || json.errors) {
                return Promise.reject({msg: "Error response from Api Gateway", error: json?.errors[0]})
            }

            // json.data.loginUser = {token: "...", user: {id, email, role}}
            localStorage.setItem('user-role', json.data.loginUser.user.role);
            localStorage.setItem('user-email', json.data.loginUser.user.email);

            setSnackBarInfo({
                message: 'Inicio de sesión exitoso.',
                type: 'success',
                time: 1000,
                state: true,
                redirectHandler: () => window.location.assign('/')
            })
        }
        catch (err) {
            console.log(err)
        }
    }
    
    return (
        
        <>
            <form>
                <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                <h3>Sign In</h3>
               
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                   
                </Avatar>

                
                {/* <input id="email-input" onChange={(e)=>{setEmail(e.target.value)}} ></input>
                <label htmlFor="email-input"></label> */}
                
                <TextField
                margin="normal"
                required
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                />
                <TextField
                margin="normal"
                required
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                />
                <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Sign In
                </Button>
                
                {/* <input id="password-input" type="password" onChange={(e)=>{setPass(e.target.value)}} ></input>
                <label htmlFor="password-input"></label>
                <button onClick={loginHandler} >Ingresar</button> */}
                </Box>
            </form>
            <SnackBarNotification sncBarData={snackBarInfo} />
        </>
    )   
}

export default LoginPage;

//no model
// model check
// 10 min max