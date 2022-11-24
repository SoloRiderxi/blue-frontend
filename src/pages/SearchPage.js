import React, {useState, useEffect, useReducer} from 'react'
import {Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Helmet} from 'react-helmet-async';
import {toast, ToastContainer} from 'react-toastify';
import {getError} from '../components/utils'
import Loading from '../components/Loading';
import Message from '../components/Message';
import Product from '../components/Product';
import SearchBox from '../components/SearchBox';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case 'FETCH_FAILED':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function SearchPage() {

  const [{loading, error, products}, dispatch] = useReducer(reducer,{
    products:[],
    loading: true,
    error:'',
  });



  const {search} = useLocation();
  //console.log(search);
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const [categories, setCategories]= useState([]);

  useEffect(()=>{
    const fetchData = async()=>{
      dispatch({type:'FETCH_REQUEST'})
      try{
        const {data}= await axios.get(
          `/api/products/search?query=${query}&category=${category}`
          );
        dispatch({type:'FETCH_SUCCESS', payload:data});
        //console.log(products)
        }
      catch(e){
        dispatch({type:'FETCH_FAILED', payload:getError(e)});
        }
      }
    fetchData();
    }, [query, category])

  useEffect(()=>{
    const fetchCat = async ()=>{
      try{
        const {data} = await axios.get('/api/products/categories');
        setCategories(data);
        //console.log(categories);
      }
      catch(e){
        toast.error(getError(e));
      }
    }
    fetchCat();
  }, []);

  const getFilterUrl = (filter)=>{
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    return `/search?category=${filterCategory}&query=${filterQuery}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <ToastContainer position="top-right" limimt={1}/>
      <Row>
        <Col md={3}>
          <SearchBox query={query} />
          <h3>Department</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <Loading/>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
            {products.length === 0 && (<Message>No Products were Found</Message> )}
              <Row>
                {products.map((p) => (
                  <Col sm={6} lg={4} className="mb-3" key={p._id}>
                    <Product product={p}></Product>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}