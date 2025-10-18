import React from 'react'
import { FlatList, View, Text } from 'react-native'
import { Button, List } from 'react-native-paper'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUsers, deleteUser } from '../api/queries'
import { User } from '../types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { useSnackbar } from '../components/SnackbarProvider'

type UsersListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'UsersList'
>

export default function UsersList() {
  const navigation = useNavigation<UsersListNavProp>()
  const snackbar = useSnackbar()
  const qc = useQueryClient()

  const { data: users = [], isLoading } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  const deleteMutation = useMutation<
    User,
    Error,
    number,
    { previousUsers?: User[] }
  >({
    mutationFn: deleteUser,
    onMutate: async (id: number) => {
      await qc.cancelQueries(['users'] as any)
      const previousUsers = qc.getQueryData<User[]>(['users'])
      qc.setQueryData<User[]>(
        ['users'],
        (old) => old?.filter((u) => u.id !== id) ?? []
      )
      return { previousUsers }
    },
    onError: (_err, _id, context) => {
      if (context?.previousUsers)
        qc.setQueryData<User[]>(['users'], context.previousUsers)
      snackbar({ message: 'Delete failed', type: 'error' })
    },
    onSettled: () => qc.invalidateQueries(['users'] as any),
    onSuccess: () => snackbar({ message: 'User deleted', type: 'success' }),
  })

  return (
    <View style={{ flex: 1 }}>
      <Button
        mode="contained"
        style={{ margin: 10 }}
        onPress={() => navigation.navigate('UserForm', {})}
      >
        Add User
      </Button>

      {users.length === 0 && !isLoading && (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No users found
        </Text>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isLoading}
        onRefresh={() => qc.invalidateQueries(['users'] as any)}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.email}
            right={() => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  compact
                  onPress={() =>
                    navigation.navigate('UserForm', { id: item.id })
                  }
                >
                  Edit
                </Button>
                <Button compact onPress={() => deleteMutation.mutate(item.id)}>
                  Delete
                </Button>
              </View>
            )}
          />
        )}
      />
    </View>
  )
}
