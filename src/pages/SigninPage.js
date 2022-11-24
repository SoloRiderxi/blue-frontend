import { Link, useLocation, useNavigate} from 'react-router-dom';
import {useState, useEffect, useContext} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import {Store} from '../Store'
import Axios from 'axios';
import {toast} from 'react-toastify';
import {getError} from '../components/utils'

const SigninPage = () => {

  const{state, dispatch:atcDispatch}= useContext(Store);
  const {userInfo} = state;
  const { search } = useLocation();
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const navigate = useNavigate();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const submitHandler= async(e)=>{
    e.preventDefault();
    try{
      const {data} = await Axios.post('/api/users/signin', {
        email,
        password
      });

      atcDispatch({type:'SGIN_IN', payload:data});
      localStorage.setItem('userInfo', JSON.stringify(data));
      //navigate(redirect || '/');
      window.location.replace(redirect || "/");
          }

    catch(e){
      toast.error(getError(e));
    }
  }

  useEffect(()=>{
    if(userInfo){
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required 
            onChange={(e)=>setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required
            onChange={(e)=>setPassword(e.target.value)} />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer?!{' '}
          <Link to={`/signup?redirect=${redirect}`}>
          	Create an account
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default SigninPage;