import React, {useState, useContext, useReducer} from 'react';
import {useNavigate} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {toast} from 'react-toastify';
import {getError} from '../components/utils';
import Loading from '../components/Loading';
import {Store} from '../Store'

const reducer=(state, action)=>{
	switch (action.type){
		case 'UPDATE_REQUEST':
			return {...state, loading:true};

		case 'UPDATE_SUCCESS':
			return{...state, loading:false};

		case 'UPDATE_FAILED':
			return{...state, loading:false};

		default:
			return state;
	}
}

const Profile = () => {

	const {state, dispatch:atcDispatch} = useContext(Store);
	const{ userInfo}=state;

	const navigate = useNavigate();
	const [name, setName]= useState(userInfo.name);
	const [email, setEmail]= useState(userInfo.email);
	const [password, setPassword]= useState('');
	const [confirmPassword, setConfirmPassword]=useState('');

	const [{loading}, dispatch]=useReducer(reducer, {loading:false});

	const submitHandler = async (e)=>{
		e.preventDefault();
		dispatch({type:'UPDATE_REQUEST'});
		if(password !== confirmPassword){
      toast.error('Password Do Not Match!');
      return
    }
		try{
			const {data} = await axios.put('api/users/profile', 
			{name, email, password}, //go to the backend req.body
			{headers:{authorization: `Bearer ${userInfo.token}`}}
			);
			dispatch({type:'UPDATE_SUCCESS'});

			atcDispatch({type:'SIGN_IN', payload:data});
			localStorage.setItem('userInfo', JSON.stringify(data));
			toast.success('Your info was upated successfully')
			navigate('/');
		}
		catch(e){
			dispatch({type:'UPDATE_FAILED'});
			toast.error(getError(e));
		}
	}	

	return(
		<Container className="small-container">
      <Helmet>
        <title>Update</title>
      </Helmet>
      <h1>Update</h1>
      <Form onSubmit={submitHandler}>
       
        <Form.Group className="m-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control required value={name}
            onChange={(e)=>setName(e.target.value)} />
        </Form.Group>

        <Form.Group className="m-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required value={email}
            onChange={(e)=>setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="m-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required
            onChange={(e)=>setPassword(e.target.value)} />
        </Form.Group>

      <Form.Group className="m-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" required
            onChange={(e)=>setConfirmPassword(e.target.value)} />
        </Form.Group>

        <div className="m-3">
          <Button type="submit">Update</Button>
        </div>
        <div className="m-3">
          {loading && <Loading/>}
        </div>
      </Form>
    </Container>
		)
}

export default Profile;