import React, { createContext, useContext } from "react";
import { useProductReducer } from './reducers';

// creates a new Context object
const StoreContext = createContext(); 
// Provider: a special type of React component that we wrap our application in so it can make the state data that's passed into it as a prop available to all other components
// Consumer: our means of grabbing and using the data that the Provider holds for us
const { Provider } = StoreContext;

// create a custom provider function that will be used to manage and update our state using the reducer we created earlier
// value & props: parameters defined to accept props if it needs to
// value: opens us up to pass in more data for state if we need to, makes it more flexible
// props: to handle any other props the user may need. 
//  Namely, we'll need to use props.children, as this <StoreProvider> component will wrap all of our other components, making them children of it. 
//  If we didn't include {...props} in our returning <Provider> component, nothing on the page would be rendered!
const StoreProvider = ({ value = [], ...props }) => {
    // instantiate our initial global state with the useProductReducer() function
    //  which wraps it around the useReducer() Hook from React
    const [state, dispatch] = useProductReducer({
      products: [],
      categories: [],
      currentCategory: '',
    });
    // use this to confirm it works!
    console.log(state);
    // state: the most up-to-date version of our global state object (new state)
    // dispatch: the method we execute to update our state, which is specifically going to look for an action object passed in as its argument
    // Provider: return StoreContext's <Provider> component with our state object and dispatch the function provided as data for the value prop
    // StoreProvider() is more like our own custom <Provider> component than a function
    return <Provider value={[state, dispatch]} {...props} />;
  };

// When we execute this function from within a component, we will receive the [state, dispatch] data our StoreProvider provider manages for us. 
//  This means that any component that has access to our StoreProvider component can use any data in our global state container or update it using the dispatch function
const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
