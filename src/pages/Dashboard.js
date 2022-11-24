import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import {getError} from '../components/utils'
import { Store } from '../Store';
import Loading from '../components/Loading';
import Message from '../components/Message';

const reducer=(state, action)=>{
  switch (action.type){
    case 'FETCH_REQUEST':
      return {...state, loading:true};

    case 'FETCH_SUCCESS':
      return{...state, summary:action.payload, loading:false};

    case 'FETCH_FAILED':
      return{...state, loading:false, error:action.payload};
    
    default:
      return {...state}
    }

  }

export default function Dashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(()=>{
    dispatch({type:'FETCH_REQUEST'});
    const fetchSum = async ()=>{
      try{
        const {data} = await axios.get('/api/orders/summary', 
          {headers: { Authorization: `Bearer ${userInfo.token}`} }
          );
        dispatch({type:'FETCH_SUCCESS', payload: data});
        //console.log(data);
      }
      catch(e){
        dispatch({type:'FETCH_FAILED', payload:getError(e)})
      }
    }
    fetchSum()
  }, [userInfo]);


  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (<Loading/>):
        error ? (<Message variant="danger">{error}</Message>):
        (  <>
           <Row>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    {summary.users[0] ? summary.users[0].numUsers : 0}
                  </Card.Title>
                  <Card.Text className="text-center"> Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    {summary.orders[0] ? summary.orders[0].numOrders : 0}
                  </Card.Title>
                  <Card.Text className="text-center"> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    $
                    {summary.orders[0] ?summary.orders[0].totalSales : 0}
                  </Card.Title>
                  <Card.Text className="text-center"> Genarated</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    {summary.products[0] ? summary.products[0].numProducts: 0}
                  </Card.Title>
                  <Card.Text className="text-center">Products</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            </Row>
            </>

          )
      }
    </div>
  )
}
