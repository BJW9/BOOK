import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Truck } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { formatPrice, formatDate } from '../utils/formatters'

const OrderConfirmationPage = () => {
  const { orderId } = useParams()
  const { orders, fetchOrders } = useOrders()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      await fetchOrders()
      setLoading(false)
    }
    loadOrder()
  }, [])

  useEffect(() => {
    if (orders.length > 0 && orderId) {
      const foundOrder = orders.find(o => o.id === orderId)
      setOrder(foundOrder)
    }
  }, [orders, orderId])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Commande non trouvée.</p>
            <Link to="/">
              <Button className="mt-4">Retour à l'accueil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getDeliveryMethodName = (method) => {
    switch (method) {
      case 'domicile':
        return 'Livraison à domicile'
      case 'point_relais':
        return 'Point Relais Mondial Relay'
      case 'express':
        return 'Livraison Express'
      default:
        return method
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* En-tête de confirmation */}
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Commande confirmée !
        </h1>
        <p className="text-gray-600">
          Merci pour votre achat. Votre commande a été enregistrée avec succès.
        </p>
      </div>

      {/* Détails de la commande */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Commande #{order.id.slice(0, 8)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Date de commande</p>
              <p className="text-gray-600">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="font-medium">Statut</p>
              <p className="text-yellow-600 font-medium">En cours de traitement</p>
            </div>
            <div>
              <p className="font-medium">Mode de livraison</p>
              <p className="text-gray-600">{getDeliveryMethodName(order.delivery_method)}</p>
            </div>
            <div>
              <p className="font-medium">Montant total</p>
              <p className="text-gray-900 font-bold">{formatPrice(order.total_amount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles commandés */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Articles commandés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.products?.name || 'Produit'}</p>
                  <p className="text-sm text-gray-600">Quantité : {item.quantity}</p>
                </div>
                <p className="font-medium">
                  {formatPrice(item.price_at_order * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adresse de livraison */}
      {order.shipping_address && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Adresse de livraison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p>{order.shipping_address.street}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
              <p>{order.shipping_address.country}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prochaines étapes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prochaines étapes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Commande confirmée</p>
                <p className="text-gray-600">Votre commande a été enregistrée</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Préparation en cours</p>
                <p className="text-gray-600">Nous préparons votre commande</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Expédition</p>
                <p className="text-gray-600">Votre commande sera expédiée sous 24-48h</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Livraison</p>
                <p className="text-gray-600">
                  {order.delivery_method === 'express' 
                    ? 'Livraison en 24h' 
                    : 'Livraison en 2-3 jours ouvrés'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/profile" className="flex-1">
          <Button variant="outline" className="w-full">
            Voir mes commandes
          </Button>
        </Link>
        <Link to="/" className="flex-1">
          <Button className="w-full">
            Continuer les achats
          </Button>
        </Link>
      </div>

      {/* Informations de contact */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
        <p>
          Un email de confirmation a été envoyé à votre adresse.
          Pour toute question, contactez-nous à{' '}
          <a href="mailto:contact@librairie-lumiere.fr" className="text-purple-600 hover:underline">
            contact@librairie-lumiere.fr
          </a>
        </p>
      </div>
    </div>
  )
}

export default OrderConfirmationPage

