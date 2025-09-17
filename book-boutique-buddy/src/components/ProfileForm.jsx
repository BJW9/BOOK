import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../hooks/useUser'

const ProfileForm = () => {
  const { user } = useAuth()
  const { profile, updateProfile } = useUser()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || ''
      })
    } else if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || ''
      })
    }
  }, [profile, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await updateProfile(formData)
    
    if (error) {
      setMessage('Erreur lors de la mise à jour du profil')
    } else {
      setMessage('Profil mis à jour avec succès')
    }
    
    setLoading(false)
    
    // Effacer le message après 3 secondes
    setTimeout(() => setMessage(''), 3000)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Nom complet</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          placeholder="Votre nom complet"
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="votre@email.com"
        />
      </div>
      
      {message && (
        <div className={`text-sm ${message.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Mise à jour...' : 'Mettre à jour'}
      </Button>
    </form>
  )
}

export default ProfileForm


