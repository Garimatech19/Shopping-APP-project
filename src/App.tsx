import { Routes, Route } from "react-router-dom";
import ProductListing from "./pages/ProductListing";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductListing />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
}

export default App;
