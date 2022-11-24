import {useContext} from 'react';
import {Store} from '../Store';
import axios from 'axios';
import {Helmet} from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Message from '../components/Message';
import ListGroup from 'react-bootstrap/ListGroup';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

export default function Cart(){
	const navigate=useNavigate();
	const{state, dispatch:atcDispatch}= useContext(Store);
	const {
		cart:{cartItems},
	} = state;

	const updateCartHandler= async(item,quantity)=>{
		const { data } = await axios.get(`/api/products/${item._id}`);

		if(data.countInStock<quantity){
			window.alert('Out of stock');
			return;
		}

		atcDispatch({
			type: 'ADD_ITEM_TO_CART',
			payload:{...item, quantity}
		});
	}

	const removeItemHandler= (item) => {
		atcDispatch({type: 'REMOVER_ITEM_FROM_CART', payload: item});
		if(state.cart.cartItems.length===1) navigate('/');
	};

	const CheckOutHandler=()=>{
		navigate('/signin?redirect=/shipping');
	}

	return(
		<div>
			<Helmet>
				<title>Cart</title>
			</Helmet>
			<h1>Shopping Cart</h1>
			<Row>
				<Col md={8}>
					{cartItems.length===0 ? 
						( <Message>Cart is empty! <Link to="/">Go to Recommended</Link></Message>)
						:
						(
							<ListGroup>
								{cartItems.map((a)=>(
									<ListGroup.Item key={a._id}>
										<Row className="align-items-center" key={a._id}>
										<Col md={4}>
											<img 
											className="img-fluid rounded img-thumbnail"
											src={a.image} 
											alt={a.slug}/>{' '}

											<Link to={`/product/${a.slug}`}>{a.name}</Link>

										</Col>
										<Col md={3}>
											<Button onClick={()=> updateCartHandler(a, a.quantity+1)} 
												variant="primary" disabled={a.quantity===a.countInStock}>
												<i className="fas fa-plus-circle"></i>
											</Button>{' '}
											<span>{a.quantity}</span>{' '}
											<Button onClick={()=> updateCartHandler(a, a.quantity-1)}
												variant="primary" disabled={a.quantity===1}>
												<i className="fas fa-minus-circle"></i>
											</Button>
										</Col>
										<Col md={3}>${a.price}</Col>
										<Col md={2}>
											<Button onClick={()=> removeItemHandler(a)} 
												variant="light">
												<i className="fas fa-trash"></i>
											</Button>
										</Col>
									</Row>
									</ListGroup.Item>
									))}
							</ListGroup>
							)
					}
				</Col>
				<Col md={4}>
					<Card>
						<Card.Body>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h3>
										Subtotal({cartItems.reduce((a, c)=> a+c.quantity, 0)}{' '}): $
										{cartItems.reduce((a,c)=> a+ c.price* c.quantity, 0)}
									</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									<div className="d-grid">
										<Button onClick={CheckOutHandler}
										 type="button" variant="primary" disabled={cartItems.length===0}>Go to Checkout</Button>
									</div>
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
		)
}