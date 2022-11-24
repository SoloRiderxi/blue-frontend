import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Store} from '../Store'
import CheckoutStatus from '../components/CheckoutStatus';

export default function PaymentMethod() {

  const navigate = useNavigate();

  const {state, dispatch:atcDispatch} = useContext(Store);
  const {cart:{shippingAddress, paymentMethod},}= state;

  const [paymentMethodName, setpaymentMethodName] = 
  useState(paymentMethod||'PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    atcDispatch({type:'PAYMENT_METHOD', payload: paymentMethodName});
    // console.log(state);
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  }

  useEffect(()=>{
    if(!shippingAddress){
      navigate('/');
    }
  }, [shippingAddress,navigate])

  return (
    <div>
      <CheckoutStatus step1 step2 step3></CheckoutStatus>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <div className="m-3">
          <Form.Check
            type="radio" id="Stripe" label="Stripe" value="Stripe"
            checked={paymentMethodName==='Stripe'} 
            onChange={(e)=> setpaymentMethodName(e.target.value)}
          />

          <Form.Check
            type="radio" id="PayPal" label="PayPal" value="PayPal"
            checked={paymentMethodName==='PayPal'} 
            onChange={(e)=> setpaymentMethodName(e.target.value)}
          />
        </div>

        <div className="m-3">
          <Button type="submit">Continue</Button>
        </div>
      </Form>
    </div>
  )
}
