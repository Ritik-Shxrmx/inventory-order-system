from fastapi import FastAPI
from database import engine, Base, SessionLocal
from sqlalchemy import Column, Integer, String
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# =========================
# CORS (IMPORTANT)
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://resilient-gnome-7413f0.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# PRODUCT TABLE
# =========================

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    sku = Column(String, unique=True)
    price = Column(Integer)
    quantity = Column(Integer)


# =========================
# CUSTOMER TABLE
# =========================

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)


# =========================
# ORDER TABLE
# =========================

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer)
    product_id = Column(Integer)
    quantity = Column(Integer)
    total_amount = Column(Integer)


# Create tables
Base.metadata.create_all(bind=engine)


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {"message": "Inventory Backend Running!"}


# =========================
# PRODUCTS
# =========================

@app.post("/add-product")
def add_product(name: str, sku: str, price: int, quantity: int):
    db = SessionLocal()

    new_product = Product(
        name=name,
        sku=sku,
        price=price,
        quantity=quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "message": "Product added successfully"
    }


@app.get("/products")
def get_products():
    db = SessionLocal()

    products = db.query(Product).all()

    return products


@app.put("/update-product")
def update_product(product_id: int, quantity: int):
    db = SessionLocal()

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return {"message": "Product not found"}

    product.quantity = quantity
    db.commit()

    return {
        "message": "Product updated successfully"
    }


@app.delete("/delete-product")
def delete_product(product_id: int):
    db = SessionLocal()

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return {"message": "Product not found"}

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }


# =========================
# CUSTOMERS
# =========================

@app.post("/add-customer")
def add_customer(full_name: str, email: str, phone: str):
    db = SessionLocal()

    new_customer = Customer(
        full_name=full_name,
        email=email,
        phone=phone
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return {
        "message": "Customer added successfully"
    }


@app.get("/customers")
def get_customers():
    db = SessionLocal()

    customers = db.query(Customer).all()

    return customers


@app.delete("/delete-customer")
def delete_customer(customer_id: int):
    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        return {"message": "Customer not found"}

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }


# =========================
# ORDERS
# =========================

@app.post("/create-order")
def create_order(
    customer_id: int,
    product_id: int,
    quantity: int
):
    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not customer:
        return {"message": "Customer not found"}

    if not product:
        return {"message": "Product not found"}

    if product.quantity < quantity:
        return {"message": "Not enough stock"}

    # Reduce stock
    product.quantity -= quantity

    # Total price
    total_amount = quantity * product.price

    new_order = Order(
        customer_id=customer_id,
        product_id=product_id,
        quantity=quantity,
        total_amount=total_amount
    )

    db.add(new_order)
    db.commit()

    return {
        "message": "Order created successfully"
    }


@app.get("/orders")
def get_orders():
    db = SessionLocal()

    orders = db.query(Order).all()

    return orders