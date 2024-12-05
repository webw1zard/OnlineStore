import React, { createContext, useState, useEffect, ReactNode } from "react";
import { fetchProducts, addProduct } from "./api";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface ProductContextProps {
  products: Product[];
  addNewProduct: (product: Omit<Product, "id">) => void;
}

export const ProductContext = createContext<ProductContextProps>({
  products: [],
  addNewProduct: () => {},
});

interface Props {
  children: ReactNode;
}

export const ProductProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
      })
  }, []);

  const addNewProduct = (product: Omit<Product, "id">) => {
    addProduct(product)
      .then((newProduct) => {
        setProducts((prev) => [...prev, newProduct]);
      })
  };

  return (
    <ProductContext.Provider value={{ products, addNewProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
