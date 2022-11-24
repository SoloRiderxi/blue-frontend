import {useParams} from 'react-router-dom';
import { useEffect, useReducer, useContext} from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../components/Rating';
import {Helmet} from 'react-helmet-async';
import Loading from '../components/Loading';
import Message from '../components/Message';
import {getError} from '../components/utils';
import {useNavigate} from 'react-router-dom';
import {Store} from '../Store';

//ProductScreen


//reducer with 3 states for the data request: Fetching,Recived and not Recived
const reducer=(state, action)=>{
  switch (action.type){
    case 'FETCH_REQUEST':
      return {...state, loading:true};

    case 'FETCH_SUCCESS':
      return{...state, product:action.payload, loading:false, error:''};

    case 'FETCH_FAILED':
      return{...state, products:[], loading:false, error:action.payload};

    default:
      return state;
  }
}

const SingleProduct = () => { //function SingleProduct
  const {slug}= useParams();
  const navigate= useNavigate();

const [{loading, error, product}, dispatch] = useReducer(reducer, {
    product:[],
    loading:true,
    error:''
  })


  useEffect(()=>{
    const fetchData = async ()=>{
      dispatch({type:'FETCH_REQUEST'});
      try{
        const result= await axios.get(`/api/products/slug/${slug}`);
        dispatch({type:'FETCH_SUCCESS', payload:result.data});//state

      }
      catch(e){
        dispatch({type:'FETCH_FAILED', payload:getError(e)})
      }
      //setProducts(result.data)
    }
    fetchData();

  }, [slug]);

  const {state, dispatch:atcDispatch}=useContext(Store);
  //intializing atcDispatch to be read to use when the user activite it and send it to Store reducer
  const {cart} = state;

  const addToCartHandler= async ()=>{
    //checking if the cart product is not more then in the stock
    const existItem= cart.cartItems.find((x)=> x._id===product._id);
    const quantity= existItem ? existItem.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${product._id}`)
    if(data.countInStock < quantity){
        window.alert("Out of stock");
        return;
    }

    // console.log(state)
    atcDispatch({
      type:'ADD_ITEM_TO_CART',
      payload:{...product, quantity}
    });
    navigate('/cart');
  };

  return (
    loading ? (<Loading/> ):
    error ? (<Message variant="danger">{error}</Message>) :
    (
        <div>
            <Row>
                <Col md={6}>
                    <img src={product.image} alt={product.slug} className="img-large"/>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush" className="product-details">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{product.name}</title>
                            </Helmet>
                            <h4>{product.name}</h4>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating rating={product.rating} reviews={product.numReviews}/>
                        </ListGroup.Item>
                        <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                        <ListGroup.Item>
                            Description: <p>{product.description}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                      <Card className="product-details">
                          <Card.Body>
                              <ListGroup>
                                  <ListGroup.Item>
                                    <Row>
                                      <Col>Price:</Col>
                                      <Col>${product.price}</Col>
                                    </Row> 
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <Row>
                                          <Col>Status:</Col>
                                          <Col>
                                              {product.countInStock>0 ?
                                                (<Badge bg="success">Available</Badge>):
                                                (<Badge bg="danger">Unavailable</Badge>)
                                              }
                                          </Col>
                                      </Row>
                                  </ListGroup.Item>

                                  {product.countInStock>0 &&(
                                    <ListGroup.Item>
                                      <div className="d-grid">
                                          <Button onClick={addToCartHandler}>
                                              Add to cart
                                          </Button>
                                      </div>
                                  </ListGroup.Item>
                                  )}
                              </ListGroup>
                          </Card.Body>
                      </Card>
                </Col>
            </Row>
        </div>
        )
    )
}

export default SingleProduct;