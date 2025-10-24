// Files inside _context/ are ignored by Expo Router as routes.

// Then your imports become:

// import { AppProvider } from "../_context/AppContext";

import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'expo-router'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState(null) // null = not logged in
  const [isLoading, setIsLoading] = useState(true) // track loading
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('https://fakestoreapi.com/products'),
          axios.get('https://fakestoreapi.com/products/categories'),
        ])
        setProducts(productsRes.data)
        setFilteredProducts(productsRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false) // mark loading finished
      }
    }
    fetchData()
  }, [])

  const addToCart = (item) => setCart([...cart, item])
  const removeFromCart = (id) => setCart(cart.filter((p) => p.id !== id))
  const clearCart = () => setCart([])
  const login = (userData) => setUser(userData)
  const logout = () => {
    setUser(null)
    router.push('/')
  }

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        products,
        filteredProducts,
        setFilteredProducts,
        categories,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
