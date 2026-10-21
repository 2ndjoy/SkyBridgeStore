import { useEffect, useMemo, useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    emoji: "🎧",
    description: "Immersive sound for work and everyday listening.",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 129.99,
    emoji: "⌚",
    description: "Keep track of your activity and daily routine.",
    badge: "Popular",
  },
  {
    id: 3,
    name: "Everyday Backpack",
    category: "Accessories",
    price: 54.99,
    emoji: "🎒",
    description: "A practical companion for study and travel.",
    badge: "",
  },
  {
    id: 4,
    name: "Desk Lamp",
    category: "Home",
    price: 39.99,
    emoji: "💡",
    description: "Comfortable lighting for your workspace.",
    badge: "New",
  },
  {
    id: 5,
    name: "Portable Speaker",
    category: "Electronics",
    price: 69.99,
    emoji: "🔊",
    description: "Bring your favourite music wherever you go.",
    badge: "",
  },
  {
    id: 6,
    name: "Travel Bottle",
    category: "Accessories",
    price: 24.99,
    emoji: "🧴",
    description: "A reusable bottle for busy days on the move.",
    badge: "",
  },
];

const money = (amount) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(amount);

function App() {
  const handleRegister = async (event) => {
    event.preventDefault();

    setRegisterMessage("");
    setRegisterError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }

    if (registerForm.password.length < 8) {
      setRegisterError("Password must be at least 8 characters.");
      return;
    }

    try {
      setRegisterLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setRegisterMessage("Account created successfully! You can now log in.");

      setRegisterForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setRegisterError(error.message || "Registration failed. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };


  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState("");
  const [adminLoginForm, setAdminLoginForm] = useState({ email: "", password: "" });
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginMessage, setAdminLoginMessage] = useState("");
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminProductForm, setAdminProductForm] = useState({
    name: "", description: "", price: "", category: "Electronics",
    imageUrl: "", stock: "0", badge: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [adminProductMessage, setAdminProductMessage] = useState("");
  const [adminProductError, setAdminProductError] = useState("");
  const [adminProductLoading, setAdminProductLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [registerMessage, setRegisterMessage] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        const data = await response.json();

        const emojiByName = {
          "Wireless Headphones": "🎧",
          "Smart Watch": "⌚",
          "Everyday Backpack": "🎒",
          "Desk Lamp": "💡",
          "Portable Speaker": "🔊",
          "Travel Bottle": "🧴",
        };

        setProducts(
          data.map((product, index) => ({
            ...product,
            id: product._id,
            emoji: emojiByName[product.name] || "📦",
            visualIndex: index + 1,
          }))
        );
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    setLoginMessage("");

    try {
      setLoginLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      setCurrentUser(data.user);
      setLoginMessage(`Welcome, ${data.user.name}!`);
      setLoginForm({ email: "", password: "" });
    } catch (error) {
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setAdminLoginError("");
    setAdminLoginMessage("");
    try {
      setAdminLoginLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminLoginForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Admin login failed.");
      if (!data.token || data.user?.role !== "admin") {
        throw new Error("The server did not return valid admin login details.");
      }
      setAdminUser(data.user);
      setAdminToken(data.token);
      setShowAdminDashboard(true);
      setAdminLoginMessage("Admin login successful.");
      setAdminLoginForm({ email: "", password: "" });
      setAdminProductMessage("");
      setAdminProductError("");
    } catch (error) {
      setAdminLoginError(error.message || "Admin login failed. Please try again.");
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setAdminToken("");
    setShowAdminDashboard(false);
    setAdminLoginError("");
    setAdminLoginMessage("Admin logged out successfully.");
    setAdminProductMessage("");
    setAdminProductError("");
    setEditingProductId(null);
    setAdminProductForm({ name: "", description: "", price: "", category: "Electronics", imageUrl: "", stock: "0", badge: "" });
  };

  const reloadProducts = async () => {
    const response = await fetch("http://localhost:5000/api/products");
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not refresh products.");
    const emojiByName = {
      "Wireless Headphones": "🎧", "Smart Watch": "⌚", "Everyday Backpack": "🎒",
      "Desk Lamp": "💡", "Portable Speaker": "🔊", "Travel Bottle": "🧴",
    };
    setProducts(data.map((product, index) => ({
      ...product,
      id: product._id,
      emoji: emojiByName[product.name] || "📦",
      visualIndex: index + 1,
    })));
  };

  const handleAdminProductSubmit = async (event) => {
    event.preventDefault();
    setAdminProductError("");
    setAdminProductMessage("");
    if (!adminToken) {
      setAdminProductError("Please log in as an admin again.");
      return;
    }
    const price = Number(adminProductForm.price);
    const stock = Number(adminProductForm.stock);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      setAdminProductError("Price must be zero or greater, and stock must be a whole number zero or greater.");
      return;
    }
    const payload = {
      name: adminProductForm.name.trim(),
      description: adminProductForm.description.trim(),
      price,
      category: adminProductForm.category,
      imageUrl: adminProductForm.imageUrl.trim(),
      stock,
      badge: adminProductForm.badge.trim(),
    };
    try {
      setAdminProductLoading(true);
      const isEditing = Boolean(editingProductId);
      const response = await fetch(
        isEditing
          ? `http://localhost:5000/api/products/${editingProductId}`
          : "http://localhost:5000/api/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save product.");
      await reloadProducts();
      setAdminProductMessage(isEditing ? "Product updated successfully." : "Product added successfully.");
      setEditingProductId(null);
      setAdminProductForm({ name: "", description: "", price: "", category: "Electronics", imageUrl: "", stock: "0", badge: "" });
    } catch (error) {
      setAdminProductError(error.message || "Could not save product.");
    } finally {
      setAdminProductLoading(false);
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setAdminProductForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "Electronics",
      imageUrl: product.imageUrl || "",
      stock: String(product.stock ?? 0),
      badge: product.badge || "",
    });
    setAdminProductMessage("");
    setAdminProductError("");
    document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setAdminProductError("");
    setAdminProductMessage("");
    try {
      setAdminProductLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete product.");
      await reloadProducts();
      setAdminProductMessage("Product deleted successfully.");
      if (editingProductId === product.id) {
        setEditingProductId(null);
        setAdminProductForm({ name: "", description: "", price: "", category: "Electronics", imageUrl: "", stock: "0", badge: "" });
      }
    } catch (error) {
      setAdminProductError(error.message || "Could not delete product.");
    } finally {
      setAdminProductLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginError("");
    setLoginMessage("You have logged out successfully.");
  };



  const categories = ["All", "Electronics", "Accessories", "Home"];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (id, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="store">
      <div className="announcement">
        Thoughtful finds for everyday living
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="SkyBridge Store home">
          <span className="brand-mark">S</span>
          <span>
            <strong>skybridge</strong>
            <small>STORE</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#products">Shop</a>
          <a href="#about">About</a>
          <a href="#login">Login</a>

          <a href="#register">Register</a>
          <a href="#admin">Admin</a>
        </nav>

        <a className="cart-link" href="#cart">
          <span aria-hidden="true">🛍️</span>
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">WELCOME TO SKYBRIDGE</span>
            <h1>Everyday essentials.<br />A little more special.</h1>
            <p>
              Discover useful, thoughtfully selected products for your home,
              work and everyday adventures.
            </p>
            <a className="primary-button" href="#products">
              Explore the collection <span aria-hidden="true">→</span>
            </a>
            <div className="hero-note">
              <span aria-hidden="true">✓</span> A simple and enjoyable way to shop
            </div>
          </div>

          <div className="hero-art" aria-label="Illustration of shopping products">
            <div className="art-circle"></div>
            <div className="art-card art-card-back">✦</div>
            <div className="art-card art-card-front">
              <span className="art-bag">🛍️</span>
              <span className="art-caption">GOOD THINGS, EVERY DAY</span>
            </div>
            <span className="floating-item floating-headphones">🎧</span>
            <span className="floating-item floating-box">📦</span>
            <span className="floating-sparkle">✳</span>
          </div>
        </section>

        <section className="benefits" aria-label="Store highlights">
          <div><span>✦</span><p><strong>Curated finds</strong><small>Useful everyday products</small></p></div>
          <div><span>♡</span><p><strong>Easy shopping</strong><small>A simple shopping experience</small></p></div>
          <div><span>↗</span><p><strong>Made for everyday</strong><small>For work, home and travel</small></p></div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE COLLECTION</span>
              <h2>Find your next favourite.</h2>
              <p>Explore our selection of everyday essentials.</p>
            </div>
            <span className="product-count">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="shop-controls">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products"
              />
            </label>

            <div className="category-filters" aria-label="Filter by category">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "filter active" : "filter"}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {loading && <p>Loading products...</p>}

          {error && <p role="alert">Error: {error}</p>}
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div
                  className={`product-image product-image-${product.visualIndex}`}
                >
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  <span className="product-emoji" aria-hidden="true">
                    {product.emoji}
                  </span>
                  <button
                    className="quick-add"
                    type="button"
                    onClick={() => addToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    +
                  </button>
                </div>

                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-bottom">
                    <strong>{money(product.price)}</strong>
                    <button
                      className="add-button"
                      type="button"
                      onClick={() => addToCart(product)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-results">
              <span>⌕</span>
              <h3>No products found</h3>
              <p>Try another search or choose a different category.</p>
              <button
                className="secondary-button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                type="button"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="cart-section" id="cart">

          <section className="cart-section" id="register">
            <div className="cart-heading">
              <div>
                <span className="eyebrow">JOIN SKYBRIDGE</span>
                <h2>Create your customer account</h2>
              </div>
            </div>

            <section className="cart-section" id="login">
              <div className="cart-heading">
                <div>
                  <span className="eyebrow">WELCOME BACK</span>
                  <h2>Customer login</h2>
                </div>
              </div>

              {currentUser ? (
                <div>
                  <p role="status">
                    Logged in as <strong>{currentUser.name}</strong>
                  </p>
                  <button
                    className="add-button"
                    type="button"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="register-form">
                  <label>
                    Email address
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm({ ...loginForm, email: event.target.value })
                      }
                      required
                      autoComplete="email"
                      
                 style={{ marginLeft: "10px" }} 
                    />
                  </label>
<br />
<br />
                  <label>
                    Password
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm({ ...loginForm, password: event.target.value })
                      }
                      required
                      autoComplete="current-password"
                      style={{ marginLeft: "10px" }}
                    />
                  </label>

                  {loginError && <p role="alert">{loginError}</p>}
                  {loginMessage && <p role="status">{loginMessage}</p>}

                  <button
                    className="add-button"
                    type="submit"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Logging in..." : "Log in"}
                  </button>
                </form>
              )}
            </section>

            <form onSubmit={handleRegister} className="register-form"   >
              <label>
                Full name
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, name: event.target.value })
                  }
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <br />
              <br />
              <label>
                Email address
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, email: event.target.value })
                  }
                  required
                  autoComplete="email"
                  style={{ marginLeft: "10px" }}
                />
              </label>

              <br />
              <br />
              <label>
                Password
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, password: event.target.value })
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  style={{ marginLeft: "10px" }}
                />
              </label>

              <br />
              <br />
              <label>
                Confirm password
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: event.target.value,
                    })
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  style={{ marginLeft: "10px" }}
                />
              </label>

              <br />
              <br />
              {registerError && <p role="alert">{registerError}</p>}
              {registerMessage && <p role="status">{registerMessage}</p>}

              <button className="add-button" type="submit" disabled={registerLoading}>
                {registerLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </section>

          <div className="cart-heading">
            <div>
              <span className="eyebrow">YOUR SELECTION</span>
              <h2>Your shopping cart</h2>
            </div>
            <span className="product-count">{cartCount} items</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <span aria-hidden="true">🛍️</span>
              <div>
                <h3>Your cart is waiting for something good.</h3>
                <p>Add a product from the collection to get started.</p>
              </div>
              <a className="secondary-button" href="#products">Browse products</a>
            </div>
          ) : (
            <div className="cart-content">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <span className="cart-item-emoji">{item.emoji}</span>
                  <div className="cart-item-details">
                    <strong>{item.name}</strong>
                    <span>{money(item.price)} each</span>
                  </div>
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, -1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                  <strong className="cart-line-total">
                    {money(item.price * item.quantity)}
                  </strong>
                  <button
                    className="remove-button"
                    type="button"
                    onClick={() =>
                      setCart((current) =>
                        current.filter((cartItem) => cartItem.id !== item.id)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="cart-summary">
                <span>Cart total</span>
                <strong>{money(cartTotal)}</strong>
              </div>
              <p className="cart-note">
                Checkout will be added in a later development stage.
              </p>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <span className="eyebrow">ABOUT SKYBRIDGE</span>
          <h2>Good products. A smoother everyday.</h2>
          <p>
            SkyBridge Store is a demonstration online shopping application
            developed to explore full-stack web development and cloud deployment.
          </p>
        </section>
        <section className="cart-section" id="admin">
          <div className="cart-heading">
            <div>
              <span className="eyebrow">STORE MANAGEMENT</span>
              <h2>Admin portal</h2>
              <p>Manage products stored in your SkyBridge Store database.</p>
            </div>
          </div>

          {!showAdminDashboard ? (
            <form onSubmit={handleAdminLogin} className="register-form">
              <h3>Administrator login</h3>
              <label>
                Admin email
                <input
                  type="email"
                  value={adminLoginForm.email}
                  onChange={(event) => setAdminLoginForm({ ...adminLoginForm, email: event.target.value })}
                  required
                  autoComplete="username"
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <br /><br />
              <label>
                Password
                <input
                  type="password"
                  value={adminLoginForm.password}
                  onChange={(event) => setAdminLoginForm({ ...adminLoginForm, password: event.target.value })}
                  required
                  autoComplete="current-password"
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <br /><br />
              {adminLoginError && <p role="alert">{adminLoginError}</p>}
              {adminLoginMessage && <p role="status">{adminLoginMessage}</p>}
              <button className="add-button" type="submit" disabled={adminLoginLoading}>
                {adminLoginLoading ? "Logging in..." : "Log in as admin"}
              </button>
            </form>
          ) : (
            <div className="admin-dashboard">
              <div className="cart-heading">
                <div>
                  <h3>Welcome, {adminUser?.name}</h3>
                  <p>Signed in as {adminUser?.email}</p>
                </div>
                <button className="secondary-button" type="button" onClick={handleAdminLogout}>Admin logout</button>
              </div>

              <form onSubmit={handleAdminProductSubmit} className="register-form">
                <h3>{editingProductId ? "Edit product" : "Add a product"}</h3>
                <label>Product name
                  <input value={adminProductForm.name} onChange={(event) => setAdminProductForm({ ...adminProductForm, name: event.target.value })} required minLength={2} maxLength={120} />
                </label>
                <br /><br />
                <label>Description
                  <textarea value={adminProductForm.description} onChange={(event) => setAdminProductForm({ ...adminProductForm, description: event.target.value })} required maxLength={1000} rows={3} />
                </label>
                <br /><br />
                <label>Price (NZD)
                  <input type="number" min="0" step="0.01" value={adminProductForm.price} onChange={(event) => setAdminProductForm({ ...adminProductForm, price: event.target.value })} required />
                </label>
                <br /><br />
                <label>Category
                  <select value={adminProductForm.category} onChange={(event) => setAdminProductForm({ ...adminProductForm, category: event.target.value })} required>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <br /><br />
                <label>Stock quantity
                  <input type="number" min="0" step="1" value={adminProductForm.stock} onChange={(event) => setAdminProductForm({ ...adminProductForm, stock: event.target.value })} required />
                </label>
                <br /><br />
                <label>Badge (optional)
                  <input value={adminProductForm.badge} onChange={(event) => setAdminProductForm({ ...adminProductForm, badge: event.target.value })} maxLength={40} />
                </label>
                <br /><br />
                <label>Image URL (optional)
                  <input type="url" value={adminProductForm.imageUrl} onChange={(event) => setAdminProductForm({ ...adminProductForm, imageUrl: event.target.value })} placeholder="https://example.com/image.jpg" />
                </label>
                <br /><br />
                {adminProductError && <p role="alert">{adminProductError}</p>}
                {adminProductMessage && <p role="status">{adminProductMessage}</p>}
                <button className="add-button" type="submit" disabled={adminProductLoading}>
                  {adminProductLoading ? "Saving..." : editingProductId ? "Save changes" : "Add product"}
                </button>
                {editingProductId && (
                  <button className="secondary-button" type="button" onClick={() => { setEditingProductId(null); setAdminProductForm({ name: "", description: "", price: "", category: "Electronics", imageUrl: "", stock: "0", badge: "" }); setAdminProductError(""); setAdminProductMessage(""); }} style={{ marginLeft: "10px" }}>
                    Cancel edit
                  </button>
                )}
              </form>

              <h3>Products ({products.length})</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead><tr>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Product</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Category</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Price</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Stock</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Actions</th>
                  </tr></thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{product.name}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{product.category}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{money(product.price)}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{product.stock ?? 0}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>
                          <button className="secondary-button" type="button" onClick={() => startEditProduct(product)} disabled={adminProductLoading}>Edit</button>{" "}
                          <button className="remove-button" type="button" onClick={() => handleDeleteProduct(product)} disabled={adminProductLoading}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark">S</span>
          <span><strong>skybridge</strong><small>STORE</small></span>
        </a>
        <p>Everyday essentials, thoughtfully brought together.</p>
        <span>© {new Date().getFullYear()} SkyBridge Store</span>
      </footer>
    </div>
  );
}

export default App;
