import React, { useContext } from 'react'
import { View } from 'react-native'
import { Text, Button } from 'react-native-elements'
import { AppContext } from '../../_context/AppContext'

export default function Users() {
  const { user, logout } = useContext(AppContext)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text h4>User Profile</Text>
      <Text>{user?.email}</Text>
      <Button
        title="Logout"
        onPress={logout}
        containerStyle={{ marginTop: 20 }}
      />
    </View>
  )
}
