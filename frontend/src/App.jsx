import "./App.css";
import { useEffect, useState } from "react";

function App() {
  // PRODUCT STATES
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // CUSTOMER STATES
  const [customers, setCustomers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // ORDER STATES
  const [orders, setOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");

  useEffect(() => {
    getProducts();
    getCustomers();
    getOrders();
  }, []);

  // PRODUCTS
  const getProducts = () => {
    fetch("http://127.0.0.1:8000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  };

  const addProduct = () => {
    fetch(
      `http://127.0.0.1:8000/add-product?name=${name}&sku=${sku}&price=${price}&quantity=${quantity}`,
      { method: "POST" }
    )
      .then((response) => response.json())
      .then(() => {
        getProducts();
        setName("");
        setSku("");
        setPrice("");
        setQuantity("");
      });
  };

  const deleteProduct = (id) => {
    fetch(
      `http://127.0.0.1:8000/delete-product?product_id=${id}`,
      { method: "DELETE" }
    )
      .then((response) => response.json())
      .then(() => getProducts());
  };

  const updateQuantity = (id) => {
    const newQuantity = prompt("Enter new quantity");

    if (!newQuantity) return;

    fetch(
      `http://127.0.0.1:8000/update-product?product_id=${id}&quantity=${newQuantity}`,
      { method: "PUT" }
    )
      .then((response) => response.json())
      .then(() => getProducts());
  };

  // CUSTOMERS
  const getCustomers = () => {
    fetch("http://127.0.0.1:8000/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data));
  };

  const addCustomer = () => {
    fetch(
      `http://127.0.0.1:8000/add-customer?full_name=${fullName}&email=${email}&phone=${phone}`,
      { method: "POST" }
    )
      .then((response) => response.json())
      .then(() => {
        getCustomers();
        setFullName("");
        setEmail("");
        setPhone("");
      });
  };

  const deleteCustomer = (id) => {
    fetch(
      `http://127.0.0.1:8000/delete-customer?customer_id=${id}`,
      { method: "DELETE" }
    )
      .then((response) => response.json())
      .then(() => getCustomers());
  };

  // ORDERS
  const getOrders = () => {
    fetch("http://127.0.0.1:8000/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data));
  };

  const createOrder = () => {
    fetch(
      `http://127.0.0.1:8000/create-order?customer_id=${selectedCustomer}&product_id=${selectedProduct}&quantity=${orderQuantity}`,
      { method: "POST" }
    )
      .then((response) => response.json())
      .then(() => {
        getOrders();
        getProducts();
        setSelectedCustomer("");
        setSelectedProduct("");
        setOrderQuantity("");
      });
  };

  return (
    <div className="app">
      <h1 className="title">Inventory Management System</h1>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className="card">
          <h3>Total Customers</h3>
          <p>{customers.length}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="card">
          <h3>Low Stock</h3>
          <p>
            {products.filter((product) => product.quantity < 5).length}
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="section">
        <h2>Products</h2>

        <div className="form-row">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button className="add-btn" onClick={addProduct}>
            Add Product
          </button>
        </div>

        {products.map((product) => (
          <div className="list-card" key={product.id}>
            <h3>{product.name}</h3>
            <p>SKU: {product.sku}</p>
            <p>Price: ₹{product.price}</p>
            <p>Quantity: {product.quantity}</p>

            <button
              className="update-btn"
              onClick={() => updateQuantity(product.id)}
            >
              Update Quantity
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteProduct(product.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* CUSTOMERS */}
      <div className="section">
        <h2>Customers</h2>

        <div className="form-row">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button className="add-btn" onClick={addCustomer}>
            Add Customer
          </button>
        </div>

        {customers.map((customer) => (
          <div className="list-card" key={customer.id}>
            <h3>{customer.full_name}</h3>
            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phone}</p>

            <button
              className="delete-btn"
              onClick={() => deleteCustomer(customer.id)}
            >
              Delete Customer
            </button>
          </div>
        ))}
      </div>

      {/* CREATE ORDER */}
      <div className="section">
        <h2>Create Order</h2>

        <div className="form-row">
          <select
            value={selectedCustomer}
            onChange={(e) =>
              setSelectedCustomer(e.target.value)
            }
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.full_name}
              </option>
            ))}
          </select>

          <select
            value={selectedProduct}
            onChange={(e) =>
              setSelectedProduct(e.target.value)
            }
          >
            <option value="">
              Select Product
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={orderQuantity}
            onChange={(e) =>
              setOrderQuantity(e.target.value)
            }
          />

          <button className="add-btn" onClick={createOrder}>
            Create Order
          </button>
        </div>
      </div>

      {/* ORDERS */}
      <div className="section">
        <h2>Orders</h2>

        {orders.map((order) => (
          <div className="list-card" key={order.id}>
            <p>Order ID: {order.id}</p>
            <p>Customer ID: {order.customer_id}</p>
            <p>Product ID: {order.product_id}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Total Amount: ₹{order.total_amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;