import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const useAddresses = () => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchAddresses = async () => {
    if (!user) return

    setLoading(true)
    
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    if (data) {
      setAddresses(data)
    }
    
    setLoading(false)
  }

  const addAddress = async (addressData) => {
    if (!user) return { error: 'Utilisateur non connecté' }

    // Si c'est l'adresse par défaut, désactiver les autres
    if (addressData.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: user.id,
        ...addressData
      })
      .select()
      .single()

    if (data) {
      setAddresses(prev => [data, ...prev])
    }

    return { data, error }
  }

  const updateAddress = async (addressId, updates) => {
    // Si c'est l'adresse par défaut, désactiver les autres
    if (updates.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', addressId)
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .update(updates)
      .eq('id', addressId)
      .select()
      .single()

    if (data) {
      setAddresses(prev => prev.map(addr => 
        addr.id === addressId ? data : addr
      ))
    }

    return { data, error }
  }

  const deleteAddress = async (addressId) => {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId)

    if (!error) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
    }

    return { error }
  }

  return {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress
  }
}


