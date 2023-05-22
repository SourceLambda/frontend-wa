import React, { useState, useEffect, useContext } from "react";
import { getCartInfo, removeItem, deleteCart } from "../../util/CartQueries";
import { createBill, UpdateStateBill } from "../../util/PlaceOrderQueries";
import GraphQLQuery from "../../util/graphQLQuery";
import {
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import basura from "../../assets/basura.png";
import { AppContext } from "../../App";
//import DeleteIcon from '@mui/icons-material/Delete';

let userId = localStorage.getItem('user-id');
let total = 0;

const ShowCart = () => {

  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const { profile } = useContext(AppContext)
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const query = getCartInfo(userId);

    async function getCart() {
      const response = await GraphQLQuery(query);

      // apigateway have no response from ms
      const jsonRes = await response.json();

      if (jsonRes.data === null || jsonRes.errors) {
        return Promise.reject({
          msg: "Error response from ApiGateway",
          error: jsonRes.errors[0],
        });
      }
      setCart(jsonRes.data.getCartInfo);
    }
    getCart()
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const creationBill = async (userId, name) => {
    console.log("1", userId);
    const query = createBill(userId, name);
    console.log("2", query);
    const response = await GraphQLQuery(query);
    console.log("3", response);
    const jsonRes = await response.json();

    if (jsonRes.errors) {
      return Promise.reject({
        msg: "Error response from ApiGateway",
        error: jsonRes.errors[0],
      });
    }
    console.log("4", jsonRes.data.createBill);

    return jsonRes.data.createBill;
  };

  const deleteItem = async (item) => {
    const query = removeItem(userId, item.itemId);
    console.log(query);
    const response = await GraphQLQuery(query);
    total = total - item.price * item.quantity;

    const jsonRes = response.json();

    if (jsonRes.errors) {
      return Promise.reject({
        msg: "Error response from ApiGateway",
        error: jsonRes.errors[0],
      });
    }
  };
  const deleteAll = async (userId) => {
    const query = deleteCart(userId);
    const response = await GraphQLQuery(query);
    const jsonRes = response.json();
    if (jsonRes.errors) {
      return Promise.reject({
        msg: "Error response from ApiGateway",
        error: jsonRes.errors[0],
      });
    }
  };
  const updateStateBill = async (idBill) => {
    const query = UpdateStateBill(idBill);
    const response = await GraphQLQuery(query);
    const jsonRes = await response.json();
    if (jsonRes.errors) {
      return Promise.reject({
        msg: "Error response from ApiGateway",
        error: jsonRes.errors[0],
      });
    }

    console.log("update", jsonRes.data.updateStateBill);
    return jsonRes.data.updateStateBill;
  };

  const totalCart = () => {
    total = 0;
    cart?.items.map((item) => (total = total + item.price * item.quantity));
    return total;
  };
  totalCart();

  return (
    <div>
      <Typography variant="h4">Carrito de Compras</Typography>
      <div>
        {cart?.items.map((item) => (
          <Card key={item.itemId}>
            <CardContent
              sx={{
                m: "10px",
                minWidth: 275,
                border: "3px solid #E39050",
                borderRadius: 2,
                width: 1 / 4,
                background: "#eeeeee",
              }}
            >
              <Typography variant="subtitle1">Producto: {item.name}</Typography>
              <Typography variant="subtitle1">Precio: {item.price} </Typography>
              <Typography variant="subtitle1">
                Cantidad: {item.quantity}{" "}
              </Typography>
              <Button
                sx={{ m: "20px" }}
                variant="outlined"
                onClick={async () => {
                  console.log(item);
                  console.log(cart.items);
                  await deleteItem(item);
                  //elimina el item de la vista
                  console.log(cart.items);
                  let newCart = cart.items.filter(
                    (i) => i.itemId !== item.itemId
                  );
                  console.log(newCart);
                  setCart({ items: newCart });
                }}
              >
                <img
                  style={{ display: "flex", borderRadius: "50%" }}
                  src={basura}
                  width="30px"
                ></img>
                Eliminar
              </Button>
            </CardContent>
          </Card>
        ))}
        <br></br>
        <div>
          <Card>
            <CardContent
              sx={{
                minWidth: 400,
                border: "2px solid #E39050",
                borderRadius: 4,
                width: 1 / 4,
              }}
            >
              <Typography>Total: $ {total}</Typography>
              <Button
                sx={{ m: "20px" }}
                variant="contained"
                color="secondary"
                onClick={async () => {
                setLoading(true);
                  let bill = await creationBill(userId, `${profile.firstname} ${profile.lastname}`);
                  let idBill = bill.idBill;
                  let bill1 = await updateStateBill(idBill);
                  localStorage.setItem("Bill", JSON.stringify(bill1));
                  console.log(bill1);
                  navigate("/bill-payment");
                  await deleteAll(userId);
                  setCart({ items: [] });
                setLoading(false);
                }}
              >
                Pagar
              </Button>

              <Button
                sx={{ m: "20px", margin: "5px " }}
                variant="outlined"
                color="secondary"
                onClick={async () => {
                  await deleteAll(userId);
                  setCart({ items: [] });
                }}
              >
                Vaciar Carrito
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
        {loading && <LoadingPopup />}
    </div>
  );
};

export default ShowCart;


const LoadingPopup = () => {
    return (
      <div className="loading-popup">
        <div className="loading-content">
          <h2>Procesando Pago...</h2>
          <div className="loader" />
        </div>
      </div>
    );
  };