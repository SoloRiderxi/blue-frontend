import React,{useEffect, useContext, useReducer} from 'react';
import {useNavigate} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import axios from 'axios';
import {getError} from '../components/utils';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Loading from '../components/Loading';
import Message from '../components/Message';
import {Store} from '../Store';


const reducer=(state, action)=>{
  switch (action.type){
    case 'FETCH_REQUEST':
      return {...state, loading:true};

    case 'FETCH_SUCCESS':
      return{...state, orders:action.payload, loading:false, error:''};

    case 'FETCH_FAILED':
      return{...state, orders:[], loading:false, error:action.payload};

    default:
      return state;
  }
}

export default function OrdersHistory() {

  const{state}= useContext(Store);
  const {userInfo}= state;
  const navigate= useNavigate();

  const [{loading, error, orders}, dispatch]= useReducer(reducer,{
    loading:true, 
    error:'', 
    orders:{},
  });

  useEffect(()=>{
    if(!userInfo){ navigate('/signin') }
    const fetchOrders= async()=> {
      dispatch({type:'FETCH_REQUEST'});
      try{
        const {data} = await axios.get('/api/orders/mine',
          {headers: { authorization:`Bearer ${userInfo.token}`}}
          );
        dispatch({type:'FETCH_SUCCESS', payload: data});
      }
      catch(e){
        dispatch({type:'FETCH_FAILED', payload: getError(e.message)});
        // toast.error(e:message);
      }
    }

    fetchOrders()
  }, [userInfo, navigate])


  return (
    <div>
      <Helmet>
        <title>Orders History</title>
      </Helmet>
      <h1>Orders History:</h1>

      {loading  ? (<Loading/>) :
        error?(<Message variant="danger">{error}</Message>):
        (
          <Table hover responsive="sm" className="p-1">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATA</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            {orders.map((order)=>(
              <tbody key={order._id}>
              <tr>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0,10)}</td>
                <td>{order.totalPrice}</td>
                <td >{order.ispaid? order.paidAt.substring(0,10): 'No'}</td>
                <td>
                  {order.isDelivered ? order.deliveredAt.substring(0,10): 'No'}
                </td>
                <td>
                  <Button type="button" variant="primary"
                    onClick={()=> {navigate(`/order/${order._id}`)}}
                  >
                    Details
                  </Button>
                </td>
              </tr>
              </tbody>
              ))}
          </Table>

          )
      }
    </div>
  )
}