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
    },

    Mutation: {
        createProduct: async (parent, args) => {
            const { name, price, category, stock } = args;
            // console.log(args)
            const [result] = await db.query(`INSERT INTO products (name, price, category, stock)
VALUES (?, ?, ?, ?)`, [name, price, category, stock])
            const [rows] = await db.query(
                "SELECT * FROM products WHERE id = ?",
                [result.insertId]
            );
            return rows[0];
        },

        updateProduct: async (parent, args) => {
            const { id, name, price, category, stock } = args;

            await db.query(
                `UPDATE products
         SET name = ?, price = ?, category = ?, stock = ?
         WHERE id = ?`,
                [name, price, category, stock, id]
            );

            const [rows] = await db.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            return rows[0];
        },
        // deleteProduct: async (parent, args) => {
        //     const { id } = args;

        //     const [result] = await db.query(
        //         "DELETE FROM products WHERE id = ?",
        //         [id]
        //     );

        //     return result.affectedRows > 0;
        // }
deleteProduct: async (parent, args) => {
    const { id } = args;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Delete related product details first
        await connection.query(
            "DELETE FROM product_details WHERE product_id = ?",
            [id]
        );

        // Now delete the product
        const [result] = await connection.query(
            "DELETE FROM products WHERE id = ?",
            [id]
        );

        await connection.commit();

        return result.affectedRows > 0;

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}
    },


};





module.exports = getProducts;
