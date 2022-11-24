import {useNavigate, useParams, Link} from 'react-router-dom';
import {useState, useEffect, useReducer, useContext} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import {Store} from '../Store'
import {toast} from 'react-toastify';
import {getError} from '../components/utils'
import Loading from '../components/Loading';
import Message from '../components/Message';

const reducer=(state, action)=>{
  switch (action.type){
    case 'FETCH_REQUEST':
      return {...state, loading:true};

    case 'FETCH_SUCCESS':
      return{...state, user:action.payload, loading:false, error:''};

    case 'FETCH_FAILED':
      return{...state, loading:false, error:action.payload};

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true};

    case 'UPLOAD_SUCCESS':
      return {  ...state, loadingUpload: false };

    case 'UPLOAD_FAILED':
      return { ...state, loadingUpload: false };

    default:
      return state;
    }}

const EditProduct =()=> {

  const{state}= useContext(Store);
  const {userInfo} = state;

    const[{loading, error, loadingUpload}, dispatch] 
  =useReducer(reducer, {loading:false, error:'' })

  const {id} = useParams();
  const navigate = useNavigate();

  const[name, setName]= useState('');
  const[price, setPrice]= useState(0);
  const[image, setImage]= useState('');
  const[brand, setBrand]= useState('');
  const[category, setCategory]= useState('');
  const[slug, setSlug]= useState('');
  const[countInStock, setCountInStock]= useState(0);  
  const[description, setDescription]= useState('');

  useEffect(()=>{
    dispatch({type:"FETCH_REQUEST"});
    if(!userInfo.isAdmin){
      navigate('/');
    }
    else{
    const fetchPro = async ()=>{
      try{
        const {data} = await axios.get(`/api/products/${id}`, 
          {headers: { Authorization: `Bearer ${userInfo.token}`} })
        //console.log(data)
        setName(data.name);
        setBrand(data.brand);
        setCategory(data.category);
        setImage(data.image);
        setPrice(data.price);
        setSlug(data.slug);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        dispatch({type:"FETCH_SUCCESS"});
      }
      catch(e){
        toast.error(getError(e));
        dispatch({type: 'FETCH_FAILED', });
      }
      }
      fetchPro();
    }
  }, [navigate, userInfo, id]);

  const submitHandler = async (e)=>{
    e.preventDefault()
    try{
      await axios.put(`/api/products/${id}`,{
        name,
        price,
        image,
        slug,
        brand,
        category,
        description,
        countInStock,
    });
      toast.success('Product updated');
      navigate('/admin/productlist');
  }
  catch(e){
    toast.error(getError(e));
  }
  }

  const uploadImgHandler= async (e)=>{
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      toast.success('Image uploaded successfully');
      setImage(data.secure_url);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAILED', payload: getError(err) });
    }
  };

  return (
    <div>
      <Link to='/admin/productlist' className='btn btn-dark m-3'>
        Go Back
      </Link>
      <h1 className='ms-5'>Edit product:</h1>
        <Helmet>
          <title>Editing product</title>
        </Helmet>
        <Container className="small-container">
          
          {loading ?( <Loading/>): 
            error ? (<Message variant="danger">{error}</Message>):(
              <Form onSubmit={submitHandler}>

                <Form.Group controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='name'>
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    type='slug'
                    placeholder='Enter slug'
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="imageFile">
                    <Form.Label>Upload File</Form.Label>
                    <Form.Control type="file" onChange={uploadImgHandler} />
                </Form.Group>
                {loadingUpload && <Loading/>}
                <Form.Group controlId='brand'>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter brand'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='price'>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                 <Form.Group controlId='countInStock'>
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter countInStock'
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='category'>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter category'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='description'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button className="mt-3" type='submit' variant='primary'>
                  Update
                </Button>

              </Form>
              )
          }
        </Container>
          
    </div>
  )
}

export default EditProduct;