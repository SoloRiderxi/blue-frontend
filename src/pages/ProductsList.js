import React, {useEffect, useReducer, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import {LinkContainer} from 'react-router-bootstrap'
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Helmet} from 'react-helmet-async';
import Loading from '../components/Loading';
import Message from '../components/Message';
import {Store} from '../Store';

const reducer=(state, action)=>{
	switch (action.type){
		case 'FETCH_REQUEST':
			return {...state, loading:true};

		case 'FETCH_SUCCESS':
			return{...state, products:action.payload, loading:false, error:''};

		case 'FETCH_FAILED':
			return{...state, products:[], loading:false, error:action.payload};

     case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true};

    case 'DELETE_SUCCESS':
      return {...state, loadingDelete: false, successDelete: true, errorDelete:''};

    case 'DELETE_FAILED':
      return { ...state, loadingDelete: false, errorDelete:action.payload };

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true};

    case 'CREATE_SUCCESS':
      return {...state, loadingCreate: false, product:action.payload};

    case 'CREATE_FAILED':
      return { ...state, loadingCreate: false, errorCreate:action.payload };

		default:
			return state;
	}
}

export default function ProductsList(){

	const {state} = useContext(Store);
  const {userInfo}= state;
  const navigate = useNavigate();

	const [{ loading, error, products, 
    loadingDelete, successDelete, errorDelete,
    loadingCreate, errorCreate  }, 
    dispatch] = useReducer(reducer, {
		products:[],
		loading:true,
		error:''
	});

	useEffect(()=>{
		const fetchData = async ()=>{
			dispatch({type:'FETCH_REQUEST'});
			try{
				const result= await axios.get('/api/products');
				dispatch({type:'FETCH_SUCCESS', payload:result.data}); 
			}
			catch(e){
				dispatch({type:'FETCH_FAILED', payload:e.message})
			}
		}
		fetchData();

	}, [successDelete])

	const deleteHandler= async (id) => {
		dispatch({type:'DELETE_REQUEST'});
    if (window.confirm('Are you sure to delete this product?')) {
    try{
      const {data} = await axios.delete(`/api/products/${id}`,
        {headers:{ authorization: `Bearer ${userInfo.token}`}})
      dispatch({type:'DELETE_SUCCESS', payload:data})
      toast.success(data.message)
    }
    catch(e){
      dispatch({type:'DELETE_FAILED', payload:e.message})
    }

	}
  else{
      dispatch({type:'DELETE_SUCCESS'})
    }
}

	const createProductHandler= async ()=>{
    dispatch({type:'CREATE_REQUEST'});
    try{
      const {data} = await axios.post('/api/products', {} ,
      {headers:{ authorization: `Bearer ${userInfo.token}`}} ) 
      //console.log(data);
      dispatch({type:'CREATE_SUCCESS'});
      navigate(`/admin/product/${data._id}/edit`)
    }
    catch(e){
      dispatch({type:'CREATE_FAILED', payload:e.message})
    }
	}

	return (
    <div>
    <Helmet>
      <title>Produect List</title>
    </Helmet>
    <Row className="align-item-center">
    	<Col>
    		<h1>Products List:</h1>
    	</Col>
    	<Col className="text-right">
    		<Button className="ml-3" onClick={createProductHandler}>
    			<i className="fas fa-plus"></i>{' '}Create a new
    		</Button>
    	</Col>
    </Row>
    {loadingDelete && <Loading/>}
    {errorDelete && <Message variant="danger">{errorDelete}</Message>}
    {loadingCreate && <Loading/>}
    {errorCreate && <Message variant="danger">{errorDelete}</Message>}
      {loading ? (<Loading/>) 
        : error ? (<Message variant="danger">{error}</Message>):(
            <Table hover responsive="sm" className="p-1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th></th>
                </tr>
              </thead>
              {products.map((p)=>(
              <tbody key={p._id}>
              <tr>
                <td>{p._id}</td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td >{p.category}</td>
                <td>
                  <LinkContainer to={`/admin/product/${p._id}/edit`}>
                    <Button className="m-1">
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button className="m-1" type="button" variant="primary"
                    onClick={()=> deleteHandler(p._id)}>
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