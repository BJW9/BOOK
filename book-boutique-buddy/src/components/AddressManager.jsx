import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useAddresses } from '../hooks/useAddresses'

const AddressManager = () => {
  const { addresses, loading, fetchAddresses, addAddress, updateAddress, deleteAddress } = useAddresses()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postal_code: '',
    country: 'France',
    is_default: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleOpenDialog = (address = null) => {
    setEditingAddress(address)
    setFormData(address ? {
      street: address.street || '',
      city: address.city || '',
      postal_code: address.postal_code || '',
      country: address.country || 'France',
      is_default: address.is_default || false
    } : {
      street: '',
      city: '',
      postal_code: '',
      country: 'France',
      is_default: false
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData)
      } else {
        await addAddress(formData)
      }
      await fetchAddresses() // Re-fetch addresses to update the list
      setIsDialogOpen(false)
      setEditingAddress(null)
      setFormData({
        street: '',
        city: '',
        postal_code: '',
        country: 'France',
        is_default: false
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'adresse:', error)
      alert('Une erreur est survenue lors de la sauvegarde de l\'adresse')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      try {
        await deleteAddress(id)
        await fetchAddresses()
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'adresse:', error)
        alert('Une erreur est survenue lors de la suppression de l\'adresse')
      }
    }
  }

  const handleSetDefault = async (addressId) => {
    try {
      await updateAddress(addressId, { is_default: true })
      await fetchAddresses()
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'adresse par défaut:', error)
      alert('Une erreur est survenue lors de la mise à jour')
    }
  }

  if (loading) {
    return <div className="text-center py-4">Chargement des adresses...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Mes adresses</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>Ajouter une adresse</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="street">Adresse</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    street: e.target.value
                  }))}
                  placeholder="123 rue de la Paix"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      city: e.target.value
                    }))}
                    placeholder="Paris"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="postal_code">Code postal</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      postal_code: e.target.value
                    }))}
                    placeholder="75001"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    country: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    is_default: checked
                  }))}
                />
                <Label htmlFor="is_default" className="text-sm">
                  Définir comme adresse par défaut
                </Label>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Sauvegarde...' : (editingAddress ? 'Modifier' : 'Ajouter')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-center">
                Aucune adresse enregistrée. Ajoutez votre première adresse pour faciliter vos commandes.
              </p>
            </CardContent>
          </Card>
        ) : (
          addresses.map((address) => (
            <Card key={address.id} className={address.is_default ? 'ring-2 ring-purple-200' : ''}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.postal_code}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    {address.is_default && (
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        Adresse par défaut
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(address)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                    {!address.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Définir par défaut
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default AddressManager

