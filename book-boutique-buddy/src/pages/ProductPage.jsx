import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Minus, Plus, Share, Copy, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import BookCover from '../components/BookCover'

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addToCart } = useCart()

  const product = {
    id: 1,
    title: "Les Murmures du Temps",
    subtitle: "Une odyssée littéraire captivante",
    price: 24.90,
    stock: 47,
    images: [
      "/api/placeholder/400/600",
      "/api/placeholder/400/600",
      "/api/placeholder/400/600"
    ],
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-lg overflow-hidden">
            <BookCover title={product.title} />
          </div>
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-24 rounded-lg overflow-hidden border-2 ${
                  activeImage === index ? 'border-purple-500' : 'border-gray-200'
                }`}
              >
                <BookCover title={product.title} size="small" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-lg text-gray-600 mt-2">{product.subtitle}</p>
          </div>

          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {product.stock} en stock
          </Badge>

          <div className="text-3xl font-bold text-gray-900">
            {product.price.toFixed(2)} €
          </div>
          <p className="text-sm text-gray-600">TTC, livraison incluse</p>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quantité
            </label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-3">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              Ajouter au panier
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
              size="lg"
            >
              Payer avec PayPal
            </Button>
          </div>

          {/* Shipping Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Truck className="h-4 w-4" />
              <span className="font-medium">Livraison Mondial Relay</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Locker • Point Relais • Domicile
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Pour les commandes en gros, <a href="/contact" className="text-purple-600 hover:underline">nous contacter</a>
          </p>

          {/* Share */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Partager</h3>
            <Button variant="outline" className="flex items-center space-x-2">
              <Copy className="h-4 w-4" />
              <span>Copier le lien</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="shipping">Livraison & Retours</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              {product.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Format</h4>
                  <p className="text-gray-600">Broché</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Pages</h4>
                  <p className="text-gray-600">320 pages</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Langue</h4>
                  <p className="text-gray-600">Français</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">ISBN</h4>
                  <p className="text-gray-600">978-2-123456-78-9</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Délais de livraison</h4>
                <p className="text-gray-600">2-3 jours pour Point Relais et Locker, 3-5 jours pour domicile.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Frais de port</h4>
                <p className="text-gray-600">Livraison gratuite incluse dans le prix.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Retours</h4>
                <p className="text-gray-600">Retours gratuits sous 30 jours.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Vous aimerez aussi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="aspect-[3/4] mb-4">
                <BookCover title="Livre à venir" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Livre à venir</h3>
              <p className="text-sm text-gray-600">D'autres ouvrages seront bientôt disponibles...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductPage

