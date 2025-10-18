import React, { useEffect, useState } from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import { TextInput, Button, HelperText } from 'react-native-paper'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query'
import { fetchComment, createComment, updateComment } from '../api/queries'
import { Comment } from '../types'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { useSnackbar } from '../components/SnackbarProvider'

type CommentFormNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'CommentForm'
>
type CommentFormRouteProp = RouteProp<RootStackParamList, 'CommentForm'>

export default function CommentForm() {
  const navigation = useNavigation<CommentFormNavProp>()
  const route = useRoute<CommentFormRouteProp>()
  const snackbar = useSnackbar()
  const qc = useQueryClient()
  const id = route.params?.id

  const { data: comment } = useQuery<Comment, Error>({
    queryKey: ['comment', id],
    queryFn: () => fetchComment(id!),
    enabled: !!id,
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (comment) {
      setName(comment.name ?? '')
      setEmail(comment.email ?? '')
      setBody(comment.body ?? '')
    }
  }, [comment])

  const createMutation = useMutation({
    mutationFn: createComment,
    onMutate: async (newComment) => {
      await qc.cancelQueries(['comments'] as any)
      const previousComments = qc.getQueryData<Comment[]>(['comments'])
      qc.setQueryData<any[]>(['comments'], (old) => [
        { id: Math.random(), ...newComment },
        ...(old ?? []),
      ])
      return { previousComments }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousComments)
        qc.setQueryData<Comment[]>(['comments'], context.previousComments)
      snackbar({ message: 'Create failed', type: 'error' })
    },
    onSettled: () => qc.invalidateQueries(['comments'] as any),
    onSuccess: () => {
      snackbar({ message: 'Comment created', type: 'success' })
      navigation.goBack()
    },
  }) as any

  //  const updateMutation: UseMutationResult<
  //    Comment,
  //    Error,
  //    { id: number; payload: Partial<Comment> },
  //    { previousComments?: Comment[] }
  //  >
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) => updateComment(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries(['comments'] as any)
      const previousComments = qc.getQueryData<Comment[]>(['comments'])
      qc.setQueryData<Comment[]>(
        ['comments'],
        (old) => old?.map((c) => (c.id === id ? { ...c, ...payload } : c)) ?? []
      )
      return { previousComments }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousComments)
        qc.setQueryData<Comment[]>(['comments'], context.previousComments)
      snackbar({ message: 'Update failed', type: 'error' })
    },
    onSettled: () => {
      qc.invalidateQueries(['comments'] as any)
      qc.invalidateQueries(['comment', id] as any)
    },
    onSuccess: () => {
      snackbar({ message: 'Comment updated', type: 'success' })
      navigation.goBack()
    },
  }) as any

  const onSave = () => {
    const payload: Partial<Comment> = { name, email, body }
    if (!name.trim() || !email.trim() || !body.trim()) {
      snackbar({ message: 'All fields are required', type: 'error' })
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
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={{ marginTop: 12 }}
        />
        <HelperText type="error" visible={!email.trim()}>
          Email is required
        </HelperText>

        <TextInput
          label="Body"
          value={body}
          onChangeText={setBody}
          mode="outlined"
          style={{ marginTop: 12 }}
          multiline
          numberOfLines={4}
        />
        <HelperText type="error" visible={!body.trim()}>
          Comment body is required
        </HelperText>

        <Button
          mode="contained"
          onPress={onSave}
          style={{ marginTop: 20 }}
          loading={createMutation.isLoading || updateMutation.isLoading}
        >
          Save
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}
