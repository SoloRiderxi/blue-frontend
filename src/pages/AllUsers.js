import React, {useEffect, useReducer, useContext} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import {LinkContainer} from 'react-router-bootstrap'
import Table from 'react-bootstrap/Table';
import {Helmet} from 'react-helmet-async';
import Loading from '../components/Loading';
import Message from '../components/Message';
import {getError} from '../components/utils';
import {Store} from '../Store';



const reducer=(state, action)=>{
  switch (action.type){
    case 'FETCH_REQUEST':
      return {...state, loading:true};

    case 'FETCH_SUCCESS':
      return{...state, users:action.payload, loading:false, error:''};

    case 'FETCH_FAILED':
      return{...state, loading:false, error:action.payload};

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };

    case 'DELETE_SUCCESS':
      return {  ...state, loadingDelete: false, successDelete: true };

    case 'DELETE_FAILED':
      return { ...state, loadingDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
}

export default function AllUsers() {

  const{state}= useContext(Store);
  const {userInfo} = state;

  const[{users, loading, error, loadingDelete, successDelete}, 
  dispatch] =useReducer(reducer, { users:[], loading:false, error:'' })

  useEffect(()=>{
    const fetchUsers = async ()=>{
      dispatch({type:'FETCH_REQUEST'});
      try{
      const {data} = await axios.get('/api/users/all', 
        {headers:{ authorization: `Bearer ${userInfo.token}`}}
        );
      //data.filter(userInfo)
      //console.log(data);
      dispatch({type:'FETCH_SUCCESS', payload:data});
      } catch(e){
        dispatch({type:'FETCH_FAILED', payload:e.message})
      }
    }
     if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
    fetchUsers();
  }
  }, [userInfo, successDelete])

  const deleteHandler= async (user)=>{
    if (window.confirm('Are you sure to delete this user?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAILED',
        });
      }
    }
  };

  return (
    <div>
    <Helmet>
      <title>User List</title>
    </Helmet>
      <h1>Users List</h1>
      {loadingDelete && <Loading/>}
      {loading ? (<Loading/>) 
        : error ? (<Message variant="danger">{error}</Message>):(
            <Table hover responsive="sm" className="p-1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                  <th></th>
                </tr>
              </thead>
              {users.map((u)=>(
              <tbody key={u._id}>
              <tr>
                <td>{u._id}</td>
                <td>{u.name.substring(0,10)}</td>
                <td><a href={`mailto:${u.email}`}>{u.email}</a></td>
                <td >{u.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  <LinkContainer to={`/admin/user/${u._id}/edit`}>
                    <Button className="m-1">
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button className="m-1" type="button" variant="primary"
                    onClick={()=> deleteHandler(u)}>
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
              </tbody>
              ))}
            </Table>
          )}
    </div>
  )
}