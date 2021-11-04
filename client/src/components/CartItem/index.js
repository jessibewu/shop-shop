import React from 'react';
// will also update the global state to adjust item quantities here
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';

const CartItem = ({ item }) => {
  // we only destructured the dispatch() function from the useStoreContext Hook, 
  //  because the CartItem component has no need to read state
  const [, dispatch] = useStoreContext();

  const removeFromCart = item => {
    dispatch({
    type: REMOVE_FROM_CART,
    _id: item._id
    });
  };

  const onChange = (e) => {
    const value = e.target.value;
  
    if (value === '0') {
      dispatch({
        type: REMOVE_FROM_CART,
        _id: item._id
      });
    } else {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id,
        purchaseQuantity: parseInt(value) // will also automatically update the total dollar amount, because the parent Cart component re-renders whenever the global state is updated
      });
    }
  };

  return (
    <div className="flex-row">
      <div>
        <img
        // This component expects an item object as a prop and will use that object's properties to populate the JSX
          src={`/images/${item.image}`} 
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;