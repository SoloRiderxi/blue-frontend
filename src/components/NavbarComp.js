import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';
import {toast} from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {LinkContainer} from 'react-router-bootstrap';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import SearchBox from './SearchBox';
import {Store} from '../Store';
import {getError} from './utils';


export default function NavbarComp() {


  const {state, dispatch:atcDispatch} = useContext(Store);
  const{cart, userInfo} = state;

  const [categories, setCategories]= useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

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
  }, [])

  const signoutHandler = () => {
    atcDispatch({type:'SIGN_OUT'});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('paymentMethod');
    toast.success('You Loggout successfully!');
    // setTimeout(()=>{
    //   window.location.replace('/');
    // }, 1500);
    navigate('/');
    }

//()=> setShow(!show)

  return (
    <div>
    <Navbar className="mainNav" collapseOnSelect bg="primary" variant="dark" expand="lg">
      <Container>
      <Button className="me-5" variant="primary" onClick={()=> setShow(!show)}>
        <i className="fas fa-ellipsis-v"></i>
      </Button>
      <Offcanvas className="offcan" show={show} onHide={()=> setShow(!show)}>
        <SearchBox/>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Categories</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {categories.map((c)=>(
            <ul key={c}>
              <li>
                <a href={`/search?category=${c}`}>{c}</a>
              </li>
            </ul>
          ))}
        </Offcanvas.Body>
      </Offcanvas>

        {/* <NavDropdown title="Categories" id="basic-nav-dropdown" 
            className="collapsible-nav-dropdown leftSideNav">
           {categories.map((c)=>(
            <LinkContainer to={`/search?category=${c}`} key={c}>
            <NavDropdown.Item>{c}</NavDropdown.Item>
             </LinkContainer>
           ))
          }
         </NavDropdown>*/}

        <LinkContainer to="/">
          <Navbar.Brand className="mr-3">Blue Amazona</Navbar.Brand>
        </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Link  to="/cart" className="nav-link ml-auto">
                  Cart {cart.cartItems.length>0 &&(
                  <Badge pill bg="dark"> {cart.cartItems.reduce((a,c) => a+c.quantity, 0)}</Badge> ) }
                </Link>

                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown" className="collapsible-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      
                      <Link className="dropdown-item" to="#signout"
                      onClick={signoutHandler}>
                        Sign Out
                      </Link>
                  </NavDropdown>
                              ):(

                          <Link className="nav-link" to="/signin">
                                    Sign In
                                </Link>
                                )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/userlist">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                        </Nav>
                      </Navbar.Collapse>
                    </Container>
                </Navbar>
                </div>

  )
}