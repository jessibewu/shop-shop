import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';

function ProductList() {
  // retrieve current global state object and the dipatch() method to update state
  const [state, dispatch] = useStoreContext();
  // destructure the currentCategory data from state object to use in the filterProducts() function
  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // implement useEffect() Hook in order to wait for our async useQuery() response to come in
  useEffect(() => {
    // once there's an actual value for data, execute dispatch() instructing reducer() that it's the UPDATE_PRODUCTS action and it should save the array of product data to our global store
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
    }
  }, [data, dispatch]);

  // When it's done, useStoreContext() executes again, giving us the product data needed display products to the page
  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
