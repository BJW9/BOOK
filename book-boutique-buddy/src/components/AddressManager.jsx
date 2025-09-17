import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAddresses } from '../hooks/useAddresses'

const AddressManager = () => {
  const { addresses, loading, fetchAddresses, addAddress, updateAddress, deleteAddress } = useAddresses()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postal_code: '',
    country: 'France',
    is_default: false
  })

  const handleOpenDialog = (address = null) => {
    setEditingAddress(address)
    setFormData(address ? address : {
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
    if (editingAddress) {
      await updateAddress(editingAddress.id, formData)
    } else {
      await addAddress(formData)
    }
    fetchAddresses() // Re-fetch addresses to update the list
    setIsDialogOpen(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      await deleteAddress(id)
      fetchAddresses()
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

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
          <DialogContent>
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
              
              <Button type="submit" className="w-full">
                {editingAddress ? 'Modifier' : 'Ajouter'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {addresses.length === 0 ? (
          <p className="text-gray-600">Aucune adresse enregistrée.</p>
        ) : (
          addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
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
                    >
                      Supprimer
                    </Button>
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


