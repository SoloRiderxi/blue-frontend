// import { Link } from 'react-router-dom';
import { useEffect, useReducer } from "react";
import axios from "axios";
import Product from "../components/Product";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Helmet } from "react-helmet-async";
import Loading from "../components/Loading";
import Message from "../components/Message";

// import logger from 'use-reducer-logger';

//4- dealing with the result accordingly and send it to (1) if successful
const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true };

		case "FETCH_SUCCESS":
			return { ...state, products: action.payload, loading: false, error: "" };

		case "FETCH_FAILED":
			return { ...state, products: [], loading: false, error: action.payload };

		default:
			return state;
	}
};

function Home() {
	//const [products, setProducts]= useState([]);

	//1-intialising the values
	const [{ loading, error, products }, dispatch] = useReducer(reducer, {
		products: [],
		loading: true,
		error: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: "FETCH_REQUEST" });
			try {
				const result = await axios.get("/api/products"); //2-fetch here
				dispatch({ type: "FETCH_SUCCESS", payload: result.data }); //3-send the result
				//console.log(result.data)
			} catch (e) {
				dispatch({ type: "FETCH_FAILED", payload: e.message });
			}
			//setProducts(result.data)
		};
		fetchData();
	}, []);

	return (
		<div>
			<Helmet>
				<title>Blue Amazona</title>
			</Helmet>
			<h1>Recommended Products</h1>
			<div>
				{loading ? (
					<Loading />
				) : error ? (
					<Message variant="danger">{error}</Message>
				) : (
					<Row>
						{products.map((product) => (
							<Col key={product._id} sm={6} md={4} lg={3} className="mb-3">
								<Product product={product}></Product>
							</Col>
						))}
					</Row>
				)}
			</div>
		</div>
	);
}

export default Home;
