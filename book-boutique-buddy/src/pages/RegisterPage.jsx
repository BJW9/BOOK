import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await signUp(email, password, fullName)
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Vérifiez votre email pour confirmer votre inscription')
      setTimeout(() => navigate('/login'), 3000)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nom complet</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        
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
        
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        {message && (
          <div className="text-green-600 text-sm">{message}</div>
        )}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <Link to="/login" className="text-purple-600 hover:underline">
          Déjà un compte ? Se connecter
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage


