import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const useAddresses = () => {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState([])       // toujours un tableau
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAddresses = useCallback(async () => {
    // Pas d’utilisateur → pas de requête
    if (!user?.id) { 
      setAddresses([])
      return
    }

    setLoading(true)
    setError(null)

    const { data, error, status } = await supabase
      .from('user_addresses')              // ⚠️ adapte si ta table a un autre nom
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    // Table absente → on considère "aucune adresse" et on n’essaie plus en boucle
    if (status === 404) {
      setAddresses([])
      setLoading(false)
      return
    }

    if (error) {
      // Certains clients renvoient un message "relation ... does not exist"
      const missingTable =
        /does not exist/i.test(error.message || '') ||
        /relation .* does not exist/i.test(error.message || '')
      if (missingTable) {
        setAddresses([])
      } else {
        setError(error)
        setAddresses([]) // rester safe
      }
      setLoading(false)
      return
    }

    setAddresses(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [user?.id])

  // Charger quand user.id change
  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const addAddress = async (addressData) => {
    if (!user?.id) return { error: 'Utilisateur non connecté' }

    if (addressData.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert({ user_id: user.id, ...addressData })
      .select()
      .single()

    if (!error && data) setAddresses(prev => [data, ...prev])
    return { data, error }
  }

  const updateAddress = async (addressId, updates) => {
    if (!user?.id) return { error: 'Utilisateur non connecté' }

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

    if (!error && data) {
      setAddresses(prev => prev.map(addr => (addr.id === addressId ? data : addr)))
    }
    return { data, error }
  }

  const deleteAddress = async (addressId) => {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId)

    if (!error) setAddresses(prev => prev.filter(addr => addr.id !== addressId))
    return { error }
  }

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  }
}
