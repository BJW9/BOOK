import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../context/AuthContext'

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await resetPassword(email)
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Vérifiez votre email pour réinitialiser votre mot de passe')
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Réinitialiser le mot de passe</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        {message && (
          <div className="text-green-600 text-sm">{message}</div>
        )}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <Link to="/login" className="text-purple-600 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </div>
  )
}

export default ResetPasswordPage


