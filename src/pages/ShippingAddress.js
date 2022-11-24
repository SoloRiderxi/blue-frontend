import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Helmet} from 'react-helmet-async';
import {Store} from '../Store';
import CheckoutStatus from '../components/CheckoutStatus'


export default function ShippingAddress() {

  const { state, dispatch: atcDispatch } = useContext(Store);
  const { userInfo, cart: { shippingAddress },} = state;
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    atcDispatch({
      type: 'SHIPPING_ADDRESS',
      payload: { fullName, address, postalCode, city,  country, }, });

    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName, address,postalCode, city, country,
      })
    );
    navigate('/payment');
  };
  return (
    <div>
      <Helmet>
        <title>Shipping</title>
      </Helmet>

      <CheckoutStatus step1 step2></CheckoutStatus>
      <div className="container small-container">
        <h1> Shipping Info.</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="p-2 mb-3" controlId="fullName">
           <Form.Label>Full Name:</Form.Label>
           <Form.Control
            value={fullName}
            onChange={(e)=> setFullName(e.target.value)}
            required
            />
          </Form.Group>

          <Form.Group className="p-2 mb-3" controlId="address">
           <Form.Label>Address:</Form.Label>
           <Form.Control
            value={address}
            onChange={(e)=> setAddress(e.target.value)}
            required
            />
          </Form.Group>

          <Form.Group className="p-2 mb-3" controlId="postalCode">
           <Form.Label>Postal Code:</Form.Label>
           <Form.Control
            value={postalCode}
            onChange={(e)=> setPostalCode(e.target.value)}
            required
            />
          </Form.Group>

          <Form.Group className="p-2 mb-3" controlId="city">
           <Form.Label>City:</Form.Label>
           <Form.Control
            value={city}
            onChange={(e)=> setCity(e.target.value)}
            required
            />
          </Form.Group>

          <Form.Group className="p-2 mb-3" controlId="country">
           <Form.Label>Country:</Form.Label>
           <Form.Control
            value={country}
            onChange={(e)=> setCountry(e.target.value)}
            required
            />
          </Form.Group>
          <div className="p-2 mb-3 text-center">
            <Button type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
