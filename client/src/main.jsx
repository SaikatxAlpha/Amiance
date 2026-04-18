import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import CartProvider from './context/CartContext.jsx'
import AuthProvider from './context/AuthContext.jsx'
import WishlistProvider from './context/WishlistContext.jsx'

import './styles/index.css'
import './styles/components.css'
import './styles/pages.css'
import './styles/product-detail.css'
import './styles/cart-auth-additions.css'
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <App />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)