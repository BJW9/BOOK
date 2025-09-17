import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Phone, Clock, MapPin } from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Nous Contacter</h1>
        <p className="text-lg text-gray-600">
          Une question ? Besoin d'aide ? Notre équipe est à votre écoute.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Envoyer un message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nom complet *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Sujet
              </Label>
              <Select onValueChange={(value) => handleInputChange('subject', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choisissez un sujet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Question générale</SelectItem>
                  <SelectItem value="bulk">Commande en gros</SelectItem>
                  <SelectItem value="shipping">Livraison</SelectItem>
                  <SelectItem value="return">Retour/Échange</SelectItem>
                  <SelectItem value="support">Support technique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message *
              </Label>
              <Textarea
                id="message"
                placeholder="Décrivez votre demande en détail..."
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
                className="mt-1 min-h-[120px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              Envoyer le message
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de contact</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-purple-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <a 
                    href="mailto:contact@librairie-lumiere.fr" 
                    className="text-purple-600 hover:underline"
                  >
                    contact@librairie-lumiere.fr
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Phone className="h-5 w-5 text-purple-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Téléphone</h3>
                  <a 
                    href="tel:+33123456789" 
                    className="text-purple-600 hover:underline"
                  >
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-purple-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Horaires</h3>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>Lun - Ven : 9h00 - 18h00</p>
                    <p>Sam : 10h00 - 16h00</p>
                    <p>Dim : Fermé</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Adresse</h3>
                  <div className="text-gray-600 text-sm">
                    <p>123 Rue de la Lecture</p>
                    <p>75001 Paris, France</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions fréquentes</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Délais de livraison ?</h3>
                <p className="text-gray-600 text-sm">
                  2-3 jours pour Point Relais et Locker, 3-5 jours pour domicile.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Frais de port ?</h3>
                <p className="text-gray-600 text-sm">
                  La livraison est gratuite et incluse dans le prix de nos livres.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Retours et échanges ?</h3>
                <p className="text-gray-600 text-sm">
                  Retours gratuits sous 30 jours. Contactez-nous pour initier un retour.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage

