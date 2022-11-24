import React, {useEffect, useContext, useReducer} from 'react';
import{useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {Helmet} from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Loading from '../components/Loading';
import Message from '../components/Message';
import {toast} from 'react-toastify';
import {getError} from '../components/utils';
import {Store} from '../Store';

const reducer = (state, action)=>{  //OderScreen
  switch (action.type){
    case 'FETCH_REQUEST':
      return{...state, loading:true, error:''}
    case 'FETCH_SUCCESS':
      return{...state, loading:false, order: action.payload, error:''}
    case 'FETCH_FAILED':
      return {...state, loading:false, error:action.payload}

     case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAILED':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAILED':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return { ...state, loadingDeliver: false, successDeliver: false };
    default:
      return state;
}}

export default function PreviewOrders() {
  const [{loading, error, order, 
    successPay, loadingPay, 
    loadingDeliver,successDeliver }, dispatch] =
   useReducer(reducer, { loading:true, error:'', order:{}, //content
      successPay: false,  loadingPay: false, //paypal
  });
  const [{isPending}, paypalDispatch]= usePayPalScriptReducer();
  const {state} = useContext(Store);
  const {userInfo}= state;
  const navigate = useNavigate();
  const params = useParams();
  const {id:orderID} = params;

useEffect(()=>{
  //console.log(order);
  const fetchOrder = async()=>{
    try{
      dispatch({type: 'FETCH_REQUEST'})
      const {data} = await axios.get(`/api/orders/${orderID}`, {
        headers: {authorization:`Bearer ${userInfo.token}`},
        });
      dispatch({type: 'FETCH_SUCCESS', payload: data});
    }
    catch(e){
     dispatch({type:'FETCH_FAILED', payload: getError(e)});
    }
  }
  if(!userInfo){
    navigate('/login');
  }
  if(!order._id || (order._id && order._id !== orderID)){
    fetchOrder();
    if(successPay){
      dispatch({type: 'PAY_RESET'});
    }
    else{
      const loadPaypalScript= async ()=>{
        const {data:clientID} = await axios.get('/api/keys/paypal', {
          headers:{authorization:`Bearer ${userInfo.token}`}, });

        paypalDispatch({type:'restOptions', 
          value:{'client-id':clientID, currency:'USD'},});

        paypalDispatch({type:'setLoadingStatus', value:'pending'});
      }
      loadPaypalScript();
    }
  }

}, [userInfo, navigate,orderID, order._id, paypalDispatch, successPay, successDeliver])

  


  function createOrder(data, action){
    return action.order.create({
      purchase_units:[{amount:{value:order.totalPrice},},]
    })
    .then((orderID)=>{
      return orderID;
    })
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
        window.location.replace(`/order/${data.order._id}`);
      } catch (err) {
        dispatch({ type: 'PAY_FAILED', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  const deliverHandler = async ()=>{
    dispatch({type:'DELIVER_REQUEST'})
    try{
      await axios.put(`/api/orders/${orderID}/deliver`, {}, 
        {headers: { authorization: `Bearer ${userInfo.token}` },}
        )
      dispatch({type:'DELIVER_SUCCESS'});
      window.location.replace(`/order/${orderID}`);
    }
    catch(e){
      dispatch({type:'DELIVER_FAILED'});
      toast.error(getError(e));
    }

  }

    return loading ? (
    <Loading></Loading>
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderID}</title>
      </Helmet>
      <h1>Order {orderID}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered at {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <Message variant="success">
                  Paid at {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <Loading />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <Loading/>}
                  </ListGroup.Item>
                  )}
                {userInfo.isAdmin &&  (
                  <ListGroup.Item className="text-center">
                  {loadingDeliver && <Loading/> }
                    <Button size="lg" variant='dark'
                     onClick={deliverHandler}>
                      Mark as Delivered!
                    </Button>
                  </ListGroup.Item>
                  )}
              </ListGroup>
            </Card.Body>
          </Card>
          <div className="d-grid gap-2">
            <Button className="text-center" variant="outline-secondary" size="lg">
             <Link to='/'>Go to Recommanded</Link>
            </Button>
          </div>
          
        </Col>
      </Row>
    </div>
  );
}
