import { useState } from "react";
import { createUserQuery } from "../../util/authQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import { SnackBarNotification } from "../../components";

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// refactor this component in UserForm and import it here
const RegisterPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [tel,setTel] = useState("");
    const [alternativeTel, setAlternativeTel] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [role, setRole] = useState("");

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
                firstName,
                lastName,
                email,
                password: pass,
                tel,
                alternativeTel,
                birthdate,
                role
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

    function something(value) {
      console.log(JSON.stringify(value));
    }

    function something2(value) {
      console.log(value);
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
            <h3>Sign Up</h3>
            {/* <Box component="form" noValidate onSubmit={something2} sx={{ mt: 3 }}></Box> */}
                <Box component="form" Validate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange = {(e)=>{setFirstName(e.target.value)}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange = {(e)=>{setLastName(e.target.value)}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange = {(e)=>{setEmail(e.target.value)}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange = {(e)=>{setPass(e.target.value)}}
                />
                
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Tel"
                  label="Tel"
                  type="Tel"
                  id="Tel"
                  autoComplete="new-tel"
                  onChange = {(e)=>{setTel(e.target.value)}}
                />
                
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Alternative Tel"
                  label="Alternative Tel"
                  type="Alternative Tel"
                  id="Alternative Tel"
                  autoComplete="new-alternative-tel"
                  onChange = {(e)=>{setAlternativeTel(e.target.value)}}
                />
                
              </Grid>
            
              
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* I can pick the data I want bc this label returns a JSON, I can actually choose only the year, or month, or day, whatever I want */}
      <DatePicker onChange={(e)=>{setBirthdate({day:e.$D,month:e.$M,year:e.$y})}}/>
    </LocalizationProvider>  
    <Grid item xs={12}>
    <FormControl fullWidth>
    <InputLabel id="Role">Role</InputLabel>
    <Select
      labelId="Role-Label"
      id="Role"
      label="Role"
      onChange = {(e)=>{setRole(e.target.value)}}
    >
      <MenuItem value={'Admin'}>Admin</MenuItem>
    <MenuItem value={'Customer'}>Customer</MenuItem>
    </Select>
    </FormControl>
                
              </Grid> 
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={newUserHandler}
            >
              Sign Up
            </Button>
            {/* <input id="email-input" onChange={(e)=>{setEmail(e.target.value)}} ></input>
                <label htmlFor="email-input"></label>
                <input id="password-input" type="password" onChange={(e)=>{setPass(e.target.value)}} ></input>
                <label htmlFor="password-input"></label>
                <button onClick={newUserHandler} >Registrarse</button> */}
            </Box>
            </Box>

 
                
            </form>
            <SnackBarNotification sncBarData={snackBarInfo} />
        </>
    )   
}

export default RegisterPage;