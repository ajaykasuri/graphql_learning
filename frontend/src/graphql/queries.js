import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      category
      stock
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $price: Float!, $category: String!, $stock: Int!) {
    createProduct(name: $name, price: $price, category: $category, stock: $stock) {
      id
      name
      price
      category
      stock
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String!, $price: Float!, $category: String!, $stock: Int!) {
    updateProduct(id: $id, name: $name, price: $price, category: $category, stock: $stock) {
      id
      name
      price
      category
      stock
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;