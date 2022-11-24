import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
// import { useHistory } from 'react-router-dom';

export default function SearchBox(props) {

  const [query, setQuery] = useState('');
  const submitHandler=(e)=>{
    e.preventDefault();
    window.location.href = (query ? `/search/?query=${query}` : '/search');
  }

  return (
    <div>
      <Form className="d-flex me-auto m-3" onSubmit={submitHandler}>
        <InputGroup>
          <FormControl
            type="text"
            name="q"
            id="q"
            onChange={(e) => setQuery(e.target.value)}
            placeholder={props.query ? props.query : "search products..."}
            aria-label="Search Products"
            aria-describedby="button-search"
          ></FormControl>
          <Button variant="dark" type="submit" id="button-search">
            <i className="fas fa-search p-1"></i>
          </Button>
        </InputGroup>
    </Form>
    </div>
  )
}