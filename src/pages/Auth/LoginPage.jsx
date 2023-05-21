import { useState } from "react";
import { loginUserQuery } from "../../util/authQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import { SnackBarNotification } from "../../components";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Link from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { loginToProfile } from "../../util/profileMSQueries";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  //Was correct!
  const [snackBarInfo, setSnackBarInfo] = useState({
    message: "",
    barType: "info",
    time: 3000,
    state: false,
    redirectHandler: () => {},
  });

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email,
        password: pass,
      };

      // if (true){
      //     console.log(userData);
      //     console.log("It got here!");
      //     return
      // }

      const query = loginUserQuery(userData);

      const response = await GraphQLQuery(query);
      const json = await response.json();

      // error from apigateway
      if (!json.data === null || json.errors) {
        return Promise.reject({
          msg: "Error response from Api Gateway",
          error: json?.errors[0],
        });
      }

      const queryProfile = loginToProfile(userData);

      const responseProfile = await GraphQLQuery(queryProfile);
      const jsonProfile = await responseProfile.json();

      // error from apigateway
      if (!jsonProfile.data === null || jsonProfile.errors) {
        return Promise.reject({
          msg: "Error response from Api Gateway",
          error: jsonProfile?.errors[0],
        });
      }



      // json.data.loginUser = {token: "...", user: {id, email, role}}
      localStorage.setItem("user-role", json.data.loginUser.user.role);
      localStorage.setItem("user-email", json.data.loginUser.user.email);

      setSnackBarInfo({
        message: "Inicio de sesión exitoso.",
        type: "success",
        time: 1000,
        state: true,
        redirectHandler: () => window.location.assign("/"),
      });
    } catch (err) {
      console.log(err);
    }
  };
  // function something2(value) {
  //     console.log(value);
  //     console.log("You just executed something2 function!!")
  //   }

  const loginRedirectRegister = async (e) => {
    window.location.assign("/register");
  };

  const loginRedirectRecovery = async (e) => {
    window.location.assign("/recovery");
  };

  return (
    <>
      <form>
        <Box
          sx={{
            marginTop: 8,
            //marginLeft: 50,
            marginLeft: {
              xs: 10,
              sm: 20,
              md: 30,
              lg: 50,
              xl: 60,
            },
            //marginRight: 50,
            marginRight: {
              xs: 10,
              sm: 20,
              md: 30,
              lg: 50,
              xl: 60,
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Sign In</h3>

          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>

          {/* <input id="email-input" onChange={(e)=>{setEmail(e.target.value)}} ></input>
                <label htmlFor="email-input"></label> */}

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
          <TextField
            fullWidth
            margin="normal"
            required
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={loginHandler}
          >
            Sign In
          </Button>
          <Grid container >
            <Grid item xs>
              <Link href="#" variant="body2" onClick={loginRedirectRecovery}>
                {"Forgot password?"}
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" onClick={loginRedirectRegister}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          {/* <input id="password-input" type="password" onChange={(e)=>{setPass(e.target.value)}} ></input>
                <label htmlFor="password-input"></label>
                <button onClick={loginHandler} >Ingresar</button> */}
        </Box>
      </form>
      <SnackBarNotification sncBarData={snackBarInfo} />
    </>
  );
};

export default LoginPage;

//no model
// model check
// 10 min max
