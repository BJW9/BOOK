import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useAddresses } from '../hooks/useAddresses'
import { useOrders } from '../hooks/useOrders'
import { formatPrice } from '../utils/formatters'

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { addresses, fetchAddresses, loading: addressesLoading, error: addressesError } = useAddresses()
  const { createOrder } = useOrders()
  const navigate = useNavigate()

  // ✅ valeurs sûres
  const safeItems = Array.isArray(items) ? items : []
  const safeAddresses = Array.isArray(addresses) ? addresses : []

  const [selectedAddress, setSelectedAddress] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('domicile')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    postal_code: '',
    country: 'France'
  })

  // Chargement des adresses
  useEffect(() => {
    if (user) fetchAddresses()
  }, [user, fetchAddresses])

  // Pré-sélectionner une adresse
  useEffect(() => {
    if (safeAddresses.length > 0) {
      const def = safeAddresses.find(a => a.is_default)
      setSelectedAddress((def ?? safeAddresses[0]).id)
    } else {
      setSelectedAddress('')
    }
  }, [safeAddresses])

  const deliveryOptions = [
    { id: 'domicile', name: 'Livraison à domicile', description: 'Livraison standard à votre domicile', price: 4.99, delay: '2-3 jours ouvrés' },
    { id: 'point_relais', name: 'Point Relais Mondial Relay', description: 'Retrait dans un point relais près de chez vous', price: 3.99, delay: '2-3 jours ouvrés' },
    { id: 'express', name: 'Livraison Express', description: 'Livraison rapide en 24h', price: 9.99, delay: '24h' },
  ]

  const selectedDeliveryOption = deliveryOptions.find(o => o.id === deliveryMethod)
  const subtotal = Number(typeof getTotalPrice === 'function' ? getTotalPrice() : 0)
  const deliveryPrice = selectedDeliveryOption?.price || 0
  const total = subtotal + deliveryPrice

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }

    setLoading(true)
    try {
      let finalShippingAddress = null
      if (selectedAddress) {
        finalShippingAddress = safeAddresses.find(a => a.id === selectedAddress) ?? null
      } 
      if (!finalShippingAddress) {
        const { street, city, postal_code } = newAddress
        if (street && city && postal_code) {
          finalShippingAddress = newAddress
        } else {
          alert('Veuillez sélectionner une adresse de livraison ou en saisir une nouvelle.')
          setLoading(false)
          return
        }
      }

      const orderData = {
        total_amount: total,
        status: 'pending',
        shipping_address: finalShippingAddress,
        delivery_method: deliveryMethod,
        delivery_price: deliveryPrice,
        payment_method: paymentMethod
      }

      const { data: order, error } = await createOrder(orderData)
      if (error) throw error

      // Simuler un paiement
      await new Promise(r => setTimeout(r, 1000))

      clearCart()
      navigate(`/order-confirmation/${order.id}`)
    } catch (err) {
      console.error('Erreur lors de la commande:', err)
      alert('Une erreur est survenue lors de la commande. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  // ======= GUARDS d’affichage =======

  // 1) Pas connecté
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Veuillez vous connecter pour passer commande.</p>
            <Button onClick={() => navigate('/login')} className="w-full mt-4">Se connecter</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 2) Cart non encore disponible (évite lecture prématurée)
  const cartReady = Array.isArray(items)

  // 3) Panier vide
  if (safeItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Votre panier est vide.</p>
            <Button onClick={() => navigate('/')} className="w-full mt-4">Continuer les achats</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 4) Chargement des adresses
  if (addressesLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card><CardContent className="pt-6"><p className="text-center">Chargement des adresses…</p></CardContent></Card>
      </div>
    )
  }

  // 5) Erreur d’adresses (mais on laisse commander avec nouvelle adresse)
  if (addressesError) {
    console.warn('Addresses error:', addressesError)
  }

  // ======= UI =======
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne gauche */}
        <div className="space-y-6">
          {/* Adresse de livraison */}
          <Card>
            <CardHeader><CardTitle>Adresse de livraison</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {safeAddresses.length > 0 ? (
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  {safeAddresses.map((address) => (
                    <div key={address.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={address.id} id={address.id} />
                      <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">{address.street}</p>
                          <p className="text-sm text-gray-600">{address.city}, {address.postal_code}</p>
                          <p className="text-sm text-gray-600">{address.country}</p>
                          {address.is_default && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Par défaut</span>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Aucune adresse enregistrée. Veuillez saisir une nouvelle adresse :</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="street">Adresse</Label>
                      <Input id="street" value={newAddress.street}
                        onChange={(e) => setNewAddress(p => ({ ...p, street: e.target.value }))} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input id="city" value={newAddress.city}
                          onChange={(e) => setNewAddress(p => ({ ...p, city: e.target.value }))} required />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">Code postal</Label>
                        <Input id="postal_code" value={newAddress.postal_code}
                          onChange={(e) => setNewAddress(p => ({ ...p, postal_code: e.target.value }))} required />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mode de livraison */}
          <Card>
            <CardHeader><CardTitle>Mode de livraison</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                {deliveryOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{option.name}</p>
                            <p className="text-sm text-gray-600">{option.description}</p>
                            <p className="text-sm text-gray-500">Délai : {option.delay}</p>
                          </div>
                          <p className="font-medium">{formatPrice(option.price)}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Paiement */}
          <Card>
            <CardHeader><CardTitle>Paiement</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Carte bancaire (Simulé)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="cursor-pointer">PayPal (Simulé)</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">💳 Paiement simulé - Aucune carte réelle ne sera débitée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Récapitulatif */}
        <div>
          <Card className="sticky top-4">
            <CardHeader><CardTitle>Récapitulatif de commande</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {safeItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantité : {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice((item.price ?? 0) * (item.quantity ?? 0))}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{formatPrice(deliveryPrice)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? 'Traitement en cours...' : `Payer ${formatPrice(total)}`}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                En passant commande, vous acceptez nos conditions générales de vente.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
