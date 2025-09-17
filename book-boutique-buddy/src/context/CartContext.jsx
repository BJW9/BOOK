// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

function readLocalCart() {
  try {
    const raw = localStorage.getItem('cart')
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch {}
  // compat anciennes clés éventuelles
  for (const key of ['cartItems', 'panier']) {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        localStorage.setItem('cart', JSON.stringify(parsed))
        return parsed
      }
    } catch {}
  }
  return []
}

export const CartProvider = ({ children }) => {
  // ✅ init synchrone depuis localStorage
  const [items, setItems] = useState(() => readLocalCart())

  // ✅ persistance
  useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(items)) } catch {}
  }, [items])

  // Normalisation d’un item
  const normalize = (input, quantity) => {
    const q = quantity ?? input?.quantity ?? 1
    return {
      id: input.id,
      name: input.name,
      price: Number(input.price) || 0,
      quantity: Number(q) || 1,
      ...input, // laisse passer d’autres props (image, etc.)
    }
  }

  // --- Actions ---
  const addItem = (product, quantity = 1) => {
    if (!product?.id) return
    const toAdd = normalize(product, quantity)
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === toAdd.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = {
          ...copy[idx],
          ...toAdd,
          quantity: (Number(copy[idx].quantity) || 0) + (Number(toAdd.quantity) || 1),
        }
        return copy
      }
      return [...prev, toAdd]
    })
  }

  const addToCart = addItem // alias compat

  const removeItem = (id) => setItems(prev => prev.filter(p => p.id !== id))
  const removeFromCart = removeItem // alias compat

  const updateQuantity = (id, quantity) => {
    const q = Number(quantity) || 0
    if (q <= 0) return removeItem(id)
    setItems(prev => prev.map(p => (p.id === id ? { ...p, quantity: q } : p)))
  }

  const clearCart = () => setItems([])

  // --- Selectors ---
  const getTotalItems = () =>
    (items ?? []).reduce((n, it) => n + (Number(it.quantity) || 0), 0)

  const getTotalPrice = () =>
    (items ?? []).reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0)

  // Expose TOUT (avec alias pour l’ancien code)
  const value = useMemo(() => ({
    // state
    items,
    cartItems: items,          // alias pour l’ancien code
    // actions
    addItem,
    addToCart,                 // alias
    removeItem,
    removeFromCart,            // alias
    updateQuantity,
    clearCart,
    // selectors
    getTotalItems,
    getTotalPrice,
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
