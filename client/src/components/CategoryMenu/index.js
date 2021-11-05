import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { useStoreContext } from "../../utils/GlobalState";
// to use in dispatch calls
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';

import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  // retrieve the current state from the global state object and the dispatch() method to update state
  const [state, dispatch] = useStoreContext();
  // destructure { categories } out of state (cuz that's what we'll need) so we can use it to provide to our returning JSX
  const { categories } = state;
  // state doesn't have data yet, we'll need to take the categoryData that returns from the useQuery() Hook and use the dispatch() method to set our global state
  //  since useQuery is asyn and wont exist on load, we'll use useEffect 
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  // useEffect(): runs immediately on component load & when some form of state changes in that component
  //  it takes two arguments - a function to run given a certain condition, and then the condition
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of action and the data to set our global state for categories to
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      // to also write category data to the categories object store in IndexedDB when we save categories to state
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
      // to retrieve that category data from IndexedDB if we lose our internet connection
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]); // dependency array: only re-run the effect if data changes

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
