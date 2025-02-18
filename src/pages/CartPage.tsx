import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/components/ui/button";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

const CartPage = () => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      // Ensure all products have a quantity field
      const parsedCart: Product[] = JSON.parse(storedCart).map((item: Product) => ({
        ...item,
        quantity: item.quantity ?? 1, // Default quantity to 1 if missing
      }));
      setCart(parsedCart);
    }
  }, []);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return; // Prevent setting quantity to 0

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
      };

  // Calculate total price safely
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="container mx-auto  my-auto p-8 bg-slate-400">
      <h1 className="text-xl font-bold">Cart</h1>
      <Link to="/" className="text-blue-800 underline">
        Back to Products
      </Link>
      {cart.length === 0 ? (
        <p className="mt-4">Your cart is empty.</p>
      ) : (
        <div className="mt-4">
          {cart.map((item) => (
            <div key={item.id} className="border p-4 rounded flex justify-between">
              <img src={item.image} alt={item.title} className="h-20" />
              <div>
                <h2 className="font-bold">{item.title}</h2>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="border p-1 w-12"
                />
                <Button onClick={() => removeItem(item.id)} variant="destructive">
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <h2 className="font-bold mt-4">Total: ${totalPrice.toFixed(2)}</h2>
          <div className="flex space-x-2 mt-4">
           <Button variant="secondary" onClick={clearCart}>
              Clear Cart
                          </Button>
            <Button>Proceed to Checkout</Button>
         </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;


