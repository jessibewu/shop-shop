import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';

import { useStoreContext } from "../utils/GlobalState";
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from '../utils/actions';
import Cart from '../components/Cart';

function Detail() {
  // getting the global state
  const [state, dispatch] = useStoreContext();
  // grab id from window.location
  const { id } = useParams();
  
  const [currentProduct, setCurrentProduct] = useState({});

  // querying data using Apollo and destructuring the products/cart out of state
  const { loading, data } = useQuery(QUERY_PRODUCTS);  
  const { products, cart } = state;

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      });
    }
  };

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id
    });
  };
  
  useEffect(() => {
    // 1st checks to see if there's data in our global state's products array. If yes, use it to figure out which product is the current one to display w the matching _id value from useParams() Hook
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    } 
      // if not, we use the product data returned from useQuery() Hook to set product data to the global state object
      else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
    }
  }, // then we run through this all over again. But this time, there is data in the products array, and then we run setCurrentProduct() to display a single product's data 
    [products, data, dispatch, id]); // dependency array: only runs when it detects that they've changed in value!

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button 
            disabled={!cart.find(p => p._id === currentProduct._id)} 
            onClick={removeFromCart}
          >
            Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
