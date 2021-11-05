import React, { useEffect } from "react";
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
// use the custom useStoreContext Hook to establish a state variable and the dispatch() function to update the state
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";

import { idbPromise } from "../../utils/helpers";

const Cart = () => {

  const [state, dispatch] = useStoreContext();

  // to check if there's anything in the state's cart property on load. If not, retrieve data from the idb cart object store & save to the global state object
  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      // dispatch ADD_MULTIPLE_TO_CART action here because we have an array of items returning from idb, even if it's just one product saved
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    };
  
    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, dispatch]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART }); // dispatch() will call the TOGGLE_CART action
  }

  // add up prices of everything saved in state.cart
  function calculateTotal() {
    let sum = 0;
    state.cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  // If cartOpen is false, the component will return a much smaller <div>. Clicking this <div>, however, will set cartOpen to true and return the expanded shopping cart
  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        {/* should always wrap emojis/icon in a <span> element that includes role and aria-label attributes to help screen readers */}
        <span
          role="img"
          aria-label="trash">🛒</span>
      </div>
    );
  }
  console.log(state)

  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>[close]</div>
      <h2>Shopping Cart</h2>
      {state.cart.length ? (
        <div>
        {state.cart.map(item => (
            <CartItem key={item._id} item={item} />
        ))}
        <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>
            {
            Auth.loggedIn() ?
                <button>
                Checkout
                </button>
                :
                <span>(log in to check out)</span>
            }
        </div>
        </div>
    ) : (
        <h3>
        <span role="img" aria-label="shocked">
            😱
        </span>
        You haven't added anything to your cart yet!
        </h3>
        )}
    </div>
  );
};

export default Cart;