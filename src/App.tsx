import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProductProvider } from "./ProductContext";
import AdminPanel from "./AdminPanel";
import ProductList from "./ProductList";

const App: React.FC = () => {
  return (
    <ProductProvider>
      <Router>
        <div className="container">
          <h1>Product Management</h1>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </ProductProvider>
  );
};

export default App;
