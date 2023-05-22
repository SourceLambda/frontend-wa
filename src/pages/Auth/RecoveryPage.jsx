import { useState } from "react";
import { createUserQuery } from "../../util/authQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import { SnackBarNotification } from "../../components";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// refactor this component in UserForm and import it here
const RecoveryPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [isEqual,setIsEqual] = useState(false);

  const [snackBarInfo, setSnackBarInfo] = useState({
    message: "",
    barType: "info",
    time: 3000,
    state: false,
    redirectHandler: () => {},
  });

  const recoveryHandler = async (e) => {
    e.preventDefault();

    try {
      //Firewall
      if (newPassword !== repeatedPassword) {
        console.log("The password is not the same");
        setIsEqual(true);
        return;
        
      }else{
        setIsEqual(false);
      }

      const userData = {
        email,
        newPassword,
      };

      const query = recoverUserQuery(userData);

      const response = await GraphQLQuery(query);
      const json = await response.json();

      // error from apigateway
      if (!json.data === null || json.errors) {
        return Promise.reject({
          msg: "Error response from Api Gateway",
          error: json?.errors[0],
        });
      }

      setSnackBarInfo({
        message: "Recovery was a success!",
        type: "success",
        time: 1000,
        state: true,
        redirectHandler: () => window.location.assign("/login"),
      });
    } catch (err) {
      console.log(err);
    }
  };

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
          component="form"
          Validate
          sx={{
            marginTop: 8,
            marginLeft: {
              xs: 10,
              sm: 20,
              md: 30,
              lg: 40,
              xl: 50,
            },
            //marginRight: 50,
            marginRight: {
              xs: 10,
              sm: 20,
              md: 30,
              lg: 40,
              xl: 50,
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            //bgcolor: "red"
          }}
        >
          <h3>Recovery</h3>
          {/* <Box component="form" noValidate onSubmit={something2} sx={{ mt: 3 }}></Box> */}
          {/* <Box component="form" Validate sx={{ mt: 3 }}> */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {
                
                (isEqual) && 
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  This is an error alert — <strong>check it out!</strong>
                </Alert>
              }
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                id="email"
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="New password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Repeat the password"
                type="password"
                id="password"
                autoComplete="new-repeated-password"
                onChange={(e) => {
                  setRepeatedPassword(e.target.value);
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={recoveryHandler}
          >
            Recover
          </Button>
          {/* <input id="email-input" onChange={(e)=>{setEmail(e.target.value)}} ></input>
                <label htmlFor="email-input"></label>
                <input id="password-input" type="password" onChange={(e)=>{setPass(e.target.value)}} ></input>
                <label htmlFor="password-input"></label>
                <button onClick={newUserHandler} >Registrarse</button> */}
          {/* </Box> */}
        </Box>
      </form>
      <SnackBarNotification sncBarData={snackBarInfo} />
    </>
  );
};

export default RecoveryPage;
