import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "./graphql/queries";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
};

function App() {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productInput = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
    };

    if (
      !productInput.name ||
      !productInput.category ||
      Number.isNaN(productInput.price) ||
      Number.isNaN(productInput.stock)
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      if (editingId) {
        await updateProduct({
          variables: {
            id: editingId,
            ...productInput,
          },
        });
      } else {
        await createProduct({ variables: productInput });
      }

      resetForm();
      refetch();
    } catch (mutationError) {
      console.error("Mutation failed:", mutationError);
      alert(mutationError.message || "Something went wrong. Please try again.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct({ variables: { id } });
      refetch();

      if (editingId === id) {
        resetForm();
      }
    } catch (mutationError) {
      console.error("Delete failed:", mutationError);
      alert(mutationError.message || "Delete failed.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20, fontFamily: "Arial" }}>
      <h1>Products</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginBottom: 30 }}>
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ display: "grid", gap: 16 }}>
        {data?.products?.length === 0 ? (
          <p>No products available.</p>
        ) : (
          data.products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                background: editingId === product.id ? "#f5f5f5" : "#fff",
              }}
            >
              <p><strong>{product.name}</strong></p>
              <p>₹{product.price}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => handleEdit(product)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;