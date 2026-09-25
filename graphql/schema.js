
const typeDefs = `
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String!
    stock: Int!
    details:ProductDetails
  }

type ProductDetails {
id:ID!
product_id:Int!
description:String
brand:String!
color:String!
weight:Float!
}

  type Query {
    products: [Product!]!
     product(id: ID!): Product 
  }

  
`;

module.exports = typeDefs;


// no need to create new tyepquery
