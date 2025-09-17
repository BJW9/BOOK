import { Link } from 'react-router-dom'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { getTotalItems } = useCart()
  const { user, signOut } = useAuth()
  const totalItems = getTotalItems()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Librairie Lumière</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/produit" 
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Notre Livre
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="text-sm text-gray-600 hover:text-purple-600">
                  Bonjour, {user.user_metadata?.full_name || user.email}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
              </Link>
            )}
            
            <Link to="/panier">
              <Button variant="outline" className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Panier ({totalItems} article{totalItems !== 1 ? 's' : ''})</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


