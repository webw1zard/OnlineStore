import React, { useContext, useReducer } from "react";
import { ProductContext } from "./ProductContext";
import { useNavigate } from "react-router-dom";

interface State {
  name: string;
  price: number;
  category: string;
  image: string;
}

const initialState: State = {
  name: "",
  price: 0,
  category: "Fast-Food",
  image: "",
};

type Action =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_PRICE"; payload: number }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_IMAGE"; payload: string }
  | { type: "RESET" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_PRICE":
      return { ...state, price: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_IMAGE":
      return { ...state, image: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const AdminPanel: React.FC = () => {
  const { addNewProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => dispatch({ type: "SET_IMAGE", payload: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.name && state.price && state.category && state.image) {
      addNewProduct({ name: state.name, price: state.price, category: state.category, image: state.image });
      dispatch({ type: "RESET" });
      navigate("/");
      
    }
  };

  return (
    <div className="admin-form">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={state.name}
            onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={state.price}
            onChange={(e) => dispatch({ type: "SET_PRICE", payload: Number(e.target.value) })}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            value={state.category}
            onChange={(e) => dispatch({ type: "SET_CATEGORY", payload: e.target.value })}
          >
            <option value="Fast-Food">Fast-Food</option>
            <option value="Dessert">Dessert</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" onChange={handleImageUpload} />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;