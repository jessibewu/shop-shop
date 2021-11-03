import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
  } from "./actions";
  
import { useReducer } from 'react';

  export const reducer = (state, action) => {
    switch (action.type) {
      // if action type value is the value of `UPDATE_PRODUCTS`, return a new state object with an updated products array
      case UPDATE_PRODUCTS:
        return {
          // If it's that action type, we return a new object with a copy of the state argument using the spread ... operator and then set the products key to a value of a new array with the action.products value spread across it
          ...state,
          products: [...action.products]
        };

      // if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
      //  will look for a matching action value and return a new copy of state from there
      case UPDATE_CATEGORIES:
        return {
          ...state,
          categories: [...action.categories]
        };
  
      case UPDATE_CURRENT_CATEGORY:
        return {
            ...state,
            currentCategory: action.currentCategory // not in an array
        };

      // if it's none of these actions, do not update state at all and keep things the same!
      default:
        return state;
    }
  };

  export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
  }