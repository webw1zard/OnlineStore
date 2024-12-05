import React, { useContext, useReducer } from "react";
import { ProductContext } from "./ProductContext";

interface CartItem {
  id: number;
  count: number;
}

interface State {
  quantities: { [key: string]: number };
  cart: CartItem[];
  filter: string;
}

const initialState: State = {
  quantities: {},
  cart: [],
  filter: "All",
};

type Action =
  | { type: "ADD_TO_CART"; payload: { id: number; count: number } }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "INCREASE_QUANTITY"; payload: number }
  | { type: "DECREASE_QUANTITY"; payload: number }
  | { type: "RESET_QUANTITY"; payload: number }
  | { type: "SET_FILTER"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingProductIndex = state.cart.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingProductIndex === -1) {
        return {
          ...state,
          cart: [
            ...state.cart,
            { id: action.payload.id, count: action.payload.count },
          ],
          quantities: { ...state.quantities, [action.payload.id]: 0 },
        };
      } else {
        const updatedCart = [...state.cart];
        updatedCart[existingProductIndex].count += action.payload.count;
        return {
          ...state,
          cart: updatedCart,
          quantities: { ...state.quantities, [action.payload.id]: 0 },
        };
      }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case "INCREASE_QUANTITY":
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.payload]: (state.quantities[action.payload] || 0) + 1,
        },
      };
    case "DECREASE_QUANTITY":
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.payload]: Math.max(
            0,
            (state.quantities[action.payload] || 0) - 1
          ),
        },
      };
    case "RESET_QUANTITY":
      return {
        ...state,
        quantities: { ...state.quantities, [action.payload]: 0 },
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
};

const ProductList: React.FC = () => {
  const { products } = useContext(ProductContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredProducts =
    state.filter === "All"
      ? products
      : products.filter((product) => product.category === state.filter);

  const addToCart = (product: any) => {
    const quantity = state.quantities[product.id] || 0;
    if (quantity > 0) {
      dispatch({
        type: "ADD_TO_CART",
        payload: { id: product.id, count: quantity },
      });
    }
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const totalItemsInCart = state.cart.reduce(
    (total, item) => total + item.count,
    0
  );
  const toAdminPanel = () => {
    window.location.href = "http://localhost:5173/admin";
  }
  return (
    <div>
      <button className="btn btn-primary" onClick={toAdminPanel}>AdminPanel</button>
      <div className="filters">
        {["All", "Fast-Food", "Dessert", "Drinks"].map((category) => (
          <button
            key={category}
            className={`btn ${
              state.filter === category ? "btn-primary" : "btn-light"
            }`}
            onClick={() => dispatch({ type: "SET_FILTER", payload: category })}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h5>{product.name}</h5>
            <p>${product.price}</p>
            <div className="d-flex gg ">
              <button
                onClick={() =>
                  dispatch({ type: "INCREASE_QUANTITY", payload: product.id })
                }
                className="btn btn-warning"
              >
                +
              </button>
              <h3 className="counter">{state.quantities[product.id] || 0}</h3>
              <button
                onClick={() =>
                  dispatch({ type: "DECREASE_QUANTITY", payload: product.id })
                }
                className="btn btn-danger"
              >
                -
              </button>
            </div>
            <button onClick={() => addToCart(product)} className="btn btn-dark">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h4>Total Items in Cart: {totalItemsInCart}</h4>
        <div className="cart-items d-flex gap-5">
          {state.cart.map((item) => {
            const product = products.find((p) => p.id === item.id);
            if (!product) return null;
            return (
              <div key={item.id} className="cart-item">
                <h5>{product.name}</h5>
                <p>Quantity: {item.count}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
