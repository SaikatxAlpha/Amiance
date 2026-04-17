import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import TubeCursor from "./components/Effects/TubeCursor";

function App() {
    return (
        <>
            {/* Tube cursor runs globally on all pages */}
            <TubeCursor />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
        </>
    );
}

export default App;