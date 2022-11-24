import { createContext, useReducer } from "react";
import axios from "axios";

export const Store = createContext();

axios.defaults.baseURL = "https://blue-backend.vercel.app";

const intialState = {
	//intializing the cart and defining cartItems inside it
	cart: {
		cartItems: localStorage.getItem("cartItems")
			? JSON.parse(localStorage.getItem("cartItems"))
			: [],

		shippingAddress: localStorage.getItem("shippingAddress")
			? JSON.parse(localStorage.getItem("shippingAddress"))
			: {},

		paymentMethod: localStorage.getItem("paymentMethod")
			? localStorage.getItem("paymentMethod")
			: "",
	},

	userInfo: localStorage.getItem("userInfo")
		? JSON.parse(localStorage.getItem("userInfo"))
		: null,
};

function reducer(state, action) {
	switch (action.type) {
		case "ADD_ITEM_TO_CART": {
			const newItem = action.payload;
			const existItem = state.cart.cartItems.find((x) => x._id === newItem._id);
			const cartItems = existItem
				? state.cart.cartItems.map((x) =>
						x._id === existItem._id ? newItem : x
				  )
				: [...state.cart.cartItems, newItem];
			localStorage.setItem("cartItems", JSON.stringify(cartItems));
			return { ...state, cart: { ...state.cart, cartItems } };
		}

		case "REMOVER_ITEM_FROM_CART": {
			const cartItems = state.cart.cartItems.filter(
				(item) => item._id !== action.payload._id
			);
			localStorage.setItem("cartItems", JSON.stringify(cartItems));
			return { ...state, cart: { ...state.cart, cartItems } };
		}

		case "SIGN_IN": {
			return { ...state, userInfo: action.payload };
		}

		case "SIGN_OUT":
			return {
				...state,
				userInfo: null,
				cart: {
					cartItems: [],
					shippingAddress: {},
					paymentMethod: "",
				},
			};

		case "SHIPPING_ADDRESS":
			return {
				...state,
				cart: { ...state.cart, shippingAddress: action.payload },
			};

		case "PAYMENT_METHOD":
			return {
				...state,
				cart: { ...state.cart, paymentMethod: action.payload },
			};

		default: {
			return state;
		}
	}
}

export function StoreProvider(props) {
	const [state, dispatch] = useReducer(reducer, intialState);
	const value = { state, dispatch };
	return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
