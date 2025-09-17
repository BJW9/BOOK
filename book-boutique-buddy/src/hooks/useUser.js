import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useUser = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setProfile(data)
        }
      }
      
      setLoading(false)
    }

    getProfile()
  }, [])

  const updateProfile = async (updates) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      
      if (data) {
        setProfile(data)
      }
      
      return { data, error }
    }
  }

  return { profile, loading, updateProfile }
}


