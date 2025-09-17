import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import BookCover from '../components/BookCover'

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart()
  const { user } = useAuth()

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">
            Découvrez notre sélection de livres exceptionnels
          </p>
          <Link to="/produit">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuer mes achats
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Votre panier</h1>
        <p className="text-gray-600 mt-2">
          {cartItems.length} article{cartItems.length !== 1 ? 's' : ''} dans votre panier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-24 flex-shrink-0">
                <BookCover title={item.title} size="small" />
              </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {item.subtitle}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-medium text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Récapitulatif de commande
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{getTotalPrice().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium text-green-600">À partir de 3,99 €</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total estimé</span>
                  <span className="text-lg font-bold text-gray-900">
                    À partir de {(getTotalPrice() + 3.99).toFixed(2)} €
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">TTC, livraison incluse</p>
              </div>
            </div>

            <div className="space-y-3">
              {user ? (
                <Link to="/checkout" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg">
                    Procéder au paiement
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg">
                    Se connecter pour commander
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="outline" 
                className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
                size="lg"
                disabled={!user}
              >
                Payer avec PayPal
              </Button>
            </div>

            {!user && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Connectez-vous pour accéder au processus de commande complet
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ShoppingBag className="h-4 w-4" />
                <span>Livraison Mondial Relay</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Point Relais • Locker • Domicile
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/produit">
          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuer mes achats
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default CartPage

