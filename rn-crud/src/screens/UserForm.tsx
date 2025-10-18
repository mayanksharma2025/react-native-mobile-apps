import React, { useEffect, useState } from 'react'
import { View, KeyboardAvoidingView, Platform, Text } from 'react-native'
import { TextInput, Button, HelperText } from 'react-native-paper'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser, fetchUser, updateUser } from '../api/queries'
import { User } from '../types'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { useSnackbar } from '../components/SnackbarProvider'

type UserFormNavProp = NativeStackNavigationProp<RootStackParamList, 'UserForm'>
type UserFormRouteProp = RouteProp<RootStackParamList, 'UserForm'>

export default function UserForm() {
  const navigation = useNavigation<UserFormNavProp>()
  const route = useRoute<UserFormRouteProp>()
  const snackbar = useSnackbar()
  const qc = useQueryClient()
  const id = route.params?.id

  const { data: user } = useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id!),
    enabled: !!id,
  })

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setUsername(user.username ?? '')
      setEmail(user.email ?? '')
    }
  }, [user])

  const createMutation = useMutation<
    User,
    Error,
    Partial<User>,
    { previousUsers?: User[] }
  >({
    mutationFn: createUser,
    onMutate: async (newUser) => {
      await qc.cancelQueries(['users'] as any)
      const previousUsers = qc.getQueryData<any[]>(['users'])
      qc.setQueryData<any[]>(['users'], (old) => [
        { id: Math.random(), ...newUser },
        ...(old ?? []),
      ])
      return { previousUsers }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUsers)
        qc.setQueryData<User[]>(['users'], context.previousUsers)
      snackbar({ message: 'Create failed', type: 'error' })
    },
    onSettled: () => qc.invalidateQueries(['users'] as any),
    onSuccess: () => {
      snackbar({ message: 'User created', type: 'success' })
      navigation.goBack()
    },
  }) as any

  const updateMutation = useMutation<
    User,
    Error,
    { id: number; payload: Partial<User> },
    { previousUsers?: User[] }
  >({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries(['users'] as any)
      const previousUsers = qc.getQueryData<User[]>(['users'])
      qc.setQueryData<User[]>(
        ['users'],
        (old) => old?.map((u) => (u.id === id ? { ...u, ...payload } : u)) ?? []
      )
      return { previousUsers }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUsers)
        qc.setQueryData<User[]>(['users'], context.previousUsers)
      snackbar({ message: 'Update failed', type: 'error' })
    },
    onSettled: () => {
      qc.invalidateQueries(['users'] as any)
      qc.invalidateQueries(['user', id] as any)
    },
    onSuccess: () => {
      snackbar({ message: 'User updated', type: 'success' })
      navigation.goBack()
    },
  }) as any

  const onSave = () => {
    const payload: Partial<User> = { name, username, email }
    if (!name.trim() || !email.trim()) {
      snackbar({ message: 'Name and Email are required', type: 'error' })
      return
    }
    if (id) updateMutation.mutate({ id, payload })
    else createMutation.mutate(payload)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <View style={{ padding: 16 }}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
        />
        <HelperText type="error" visible={!name.trim()}>
          Name is required
        </HelperText>

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={{ marginTop: 12 }}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={{ marginTop: 12 }}
          keyboardType="email-address"
        />
        <HelperText type="error" visible={!email.trim()}>
          Email is required
        </HelperText>

        <Button
          mode="contained"
          onPress={onSave}
          style={{ marginTop: 20 }}
          loading={createMutation?.isLoading || updateMutation?.isLoading}
        >
          <Text>Save</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}
