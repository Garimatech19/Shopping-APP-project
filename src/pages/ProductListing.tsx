import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/components/ui/button";
import { ShoppingCart } from "lucide-react"; // Importing Cart Icon

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch("https://fakestoreapi.com/products");
  return res.json();
};

const ProductListing = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [cart, setCart] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const productsPerPage = 6;

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  const addToCart = (product: Product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setShowPopup(true); // Show popup message

    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const filteredProducts = products.filter((product) =>
    categoryFilter ? product.category === categoryFilter : true
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "rating") return b.rating.rate - a.rating.rate;
    return 0;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-pink-300 to-blue-300">
      {/* 🔹 Hero Section */}
      <div className="relative w-full h-80 mb-6 rounded-lg ">
        <img src="src/assets/image3.png" alt="Welcome Image" className="w-full h-full object-contain rounded-lg" />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold italic">Our All Products</h1>

        {/* Cart Icon with Item Count */}
        <Link to="/cart" className="relative">
          <ShoppingCart className="w-8 h-8 cursor-pointer" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {cart.length}
            </span>
          )}
        </Link>
      </div>

      {/* Filter & Sorting */}
      <div className="flex space-x-4 mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(products.map((p) => p.category))).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Best Rating</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow-lg">
            <img src={product.image} alt={product.title} className="h-40 mx-auto" />
            <h2 className="font-bold">{product.title}</h2>
            <p className="text-gray-600">${product.price}</p>
            <p className="text-sm text-yellow-600">⭐ {product.rating.rate} ({product.rating.count} reviews)</p>
            <Button variant="outline" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <Button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
          Prev
        </Button>
        <Button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage * productsPerPage >= sortedProducts.length}>
          Next
        </Button>
      </div>
      {/* Popup Message */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-md">
          Item added to cart!
        </div>
      )}
    </div>
  );
};

export default ProductListing;
