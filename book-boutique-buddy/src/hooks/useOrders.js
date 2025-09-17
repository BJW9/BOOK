import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchOrders = async () => {
    if (!user) return

    setLoading(true)
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, price)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data)
    }
    
    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error)
    }
    
    setLoading(false)
  }

  const createOrder = async (orderData) => {
    if (!user) return { error: 'Utilisateur non connecté' }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        ...orderData
      })
      .select()
      .single()

    if (data) {
      setOrders(prev => [data, ...prev])
    }

    return { data, error }
  }

  const updateOrderStatus = async (orderId, status) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()

    if (data) {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ))
    }

    return { data, error }
  }

  return {
    orders,
    loading,
    fetchOrders,
    createOrder,
    updateOrderStatus
  }
}


