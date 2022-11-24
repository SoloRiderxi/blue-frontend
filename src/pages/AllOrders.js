import React, { useEffect, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Loading from "../components/Loading";
import Message from "../components/Message";
import { getError } from "../components/utils";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false, error: "" };

    case "FETCH_FAILED":
      return { ...state, orders: [], loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function OrdersHistory() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    orders: {},
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    }
    const fetchOrders = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/orders/all", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        //console.log(data)
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (e) {
        dispatch({ type: "FETCH_FAILED", payload: getError(e.message) });
        // toast.error(e:message);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  return (
    <>
      <Helmet>
        <title>All orders</title>
      </Helmet>
      <h1>Orders:</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table hover responsive="sm" className="p-1">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>

          {orders.map((d) => (
            <tbody key={d._id}>
              <tr>
                <td>{d._id}</td>
                <td>{d.user.name}</td>
                <td>{d.createdAt.substring(0, 10)}</td>
                <td>${d.totalPrice}</td>
                <td>
                  {d.isPaid ? (
                    d.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {d.isDelivered ? (
                    d.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${d._id}`}>
                    <Button variant="dark" className="btn-sm">
                      Veiw
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      )}
    </>
  );
}
