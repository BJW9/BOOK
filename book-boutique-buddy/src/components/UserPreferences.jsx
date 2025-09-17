import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const UserPreferences = () => {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    marketing_emails: false,
    order_updates: true,
    newsletter: false
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchPreferences()
    }
  }, [user])

  const fetchPreferences = async () => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setPreferences(data)
    }
  }

  const updatePreferences = async () => {
    setLoading(true)

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        ...preferences
      })

    if (!error) {
      alert('Préférences mises à jour avec succès')
    } else {
      alert('Erreur lors de la mise à jour des préférences')
    }

    setLoading(false)
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email_notifications">Notifications par email</Label>
          <Switch
            id="email_notifications"
            checked={preferences.email_notifications}
            onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="marketing_emails">Emails marketing</Label>
          <Switch
            id="marketing_emails"
            checked={preferences.marketing_emails}
            onCheckedChange={(checked) => handlePreferenceChange('marketing_emails', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="order_updates">Mises à jour de commande</Label>
          <Switch
            id="order_updates"
            checked={preferences.order_updates}
            onCheckedChange={(checked) => handlePreferenceChange('order_updates', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="newsletter">Newsletter</Label>
          <Switch
            id="newsletter"
            checked={preferences.newsletter}
            onCheckedChange={(checked) => handlePreferenceChange('newsletter', checked)}
          />
        </div>

        <Button onClick={updatePreferences} disabled={loading} className="w-full">
          {loading ? 'Mise à jour...' : 'Sauvegarder les préférences'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default UserPreferences


