import {useState, useContext} from 'react';
import {Store} from '../Store';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';

function Product(props) { //productcard
	 	//console.log(props)
	 	const [disable, setDisable] = useState(false);
		const { product } = props; 
		const {state, dispatch:atcDispatch}= useContext(Store);
		const {cart:{cartItems}} = state;

		const addToCartHandler = async (item)=>{
			const existItem= cartItems.find((x)=> x._id===product._id);
	    const quantity= existItem ? existItem.quantity + 1 : 1;
	    const {data} = await axios.get(`/api/products/${product._id}`);

	    if(data.countInStock < quantity){
	    	//e.currentTarget.disabled = true;
    		setDisable(true);
	      window.alert("Out of stock");
	        return; 
	       }
	       atcDispatch({
      	 type:'ADD_ITEM_TO_CART',
      	 payload:{...item, quantity}
    			});
		}

			return (
				<Card>
					<Link to={`/product/${product.slug}`}>
						<img src={product.image} alt={product.name} className="card-img-top"/>
					</Link>

					<Card.Body>
						<Link to={`/product/${product.slug}`}>
							<Card.Title>{product.name}</Card.Title>					
						</Link>
						<Rating rating={product.rating} reviews={product.numReviews}/>
						<Card.Text>$ {product.price}</Card.Text>
						{disable ? 
							(<Button variant="light" disabled>
								Out of stock
							</Button>) :
							(
								<Button onClick={() => addToCartHandler(product)}>Add to cart
								</Button>
								)
						}
					</Card.Body>
				</Card>
			);
		
	}


export default Product;