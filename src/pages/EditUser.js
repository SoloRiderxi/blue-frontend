import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useReducer, useContext } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../components/utils";
import Loading from "../components/Loading";
import Message from "../components/Message";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, user: action.payload, loading: false, error: "" };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, successUpdate: false };

    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, successUpdate: true };

    case "UPDATE_FAILED":
      return { ...state, loadingUpdate: false };

    case "UPDATE_RESET":
      return { ...state, loadingUpdate: false, successUpdate: false };

    default:
      return state;
  }
};

const EditUser = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, successUpdate }, dispatch] =
    useReducer(reducer, { loading: false, error: "" });

  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!userInfo.isAdmin) {
      navigate("/");
    }
    if (successUpdate) {
      dispatch({ type: "UPDATE_RESET" });
    } else {
      dispatch({ type: "FETCH_REQUEST" });
      const fetchUser = async () => {
        try {
          const { data } = await axios.get(`/api/users/${id}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: "FETCH_SUCCESS" });
          setName(data.name);
          setEmail(data.email);
          setIsAdmin(data.isAdmin);
        } catch (e) {
          dispatch({ type: "FETCH_FAILED" });
          toast.error(getError(e));
          navigate("/");
        }
      };
      fetchUser();
    }
  }, [id, userInfo, navigate, successUpdate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/users/${id}`,
        { id: id, name, email, isAdmin },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      toast.success("user update successfully");
      dispatch({ type: "UPDATE_SUCCESS" });
      navigate("/admin/userlist");
    } catch (error) {
      toast.error(getError(error));
      dispatch({
        type: "UPDATE_FAILED",
      });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit user</title>
      </Helmet>
      <h1>Edit user</h1>
      {loadingUpdate && <Loading />}
      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="m-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="m-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Check
            className="m-3"
            type="checkbox"
            label="Is Admin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />

          <div className="m-3">
            <Button type="submit">Save</Button>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default EditUser;
