const db = require("../config/db");

const getProducts = {
    Query: {
        products: async (parent, args) => {
            const [rows] = await db.query("SELECT * FROM products");
            return rows;
        },
        product: async (parent, args) => {
            const [rows] = await db.query("SELECT * FROM products where id=?", [args.id])
            return rows[0]
        }
    },
    Product: {
        details: async (parent, args) => {
            const [rows] = await db.query("SELECT * FROM product_details where product_id =?", [parent.id])
            return rows[0]
        }
    }
};


module.exports = getProducts;
