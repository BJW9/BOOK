import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { useOrders } from '../hooks/useOrders'
import { formatDate, formatPrice } from '../utils/formatters'

const OrderHistory = () => {
  const { orders, loading, fetchOrders } = useOrders()

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminée'
      case 'pending':
        return 'En cours'
      case 'cancelled':
        return 'Annulée'
      default:
        return status
    }
  }

  if (loading) {
    return <div className="text-center py-4">Chargement des commandes...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Aucune commande trouvée.</p>
        <p className="text-sm text-gray-500 mt-2">
          Vos commandes apparaîtront ici une fois que vous aurez effectué un achat.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-lg">
                Commande #{order.id.slice(0, 8)}
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(order.created_at)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-lg">
                {formatPrice(order.total_amount)}
              </p>
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Articles commandés :</h4>
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.products?.name || 'Produit supprimé'} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.price_at_order * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          {order.shipping_address && (
            <div className="mt-3 pt-3 border-t">
              <h4 className="font-medium text-sm text-gray-700 mb-1">
                Adresse de livraison :
              </h4>
              <p className="text-sm text-gray-600">
                {order.shipping_address.street}, {order.shipping_address.city} {order.shipping_address.postal_code}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default OrderHistory


