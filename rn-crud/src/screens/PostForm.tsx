import React, { useEffect, useState } from 'react'
import { View, KeyboardAvoidingView, Platform, Text } from 'react-native'
import { TextInput, Button, HelperText } from 'react-native-paper'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query'
import { fetchPost, createPost, updatePost } from '../api/queries'
import { Post } from '../types'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { useSnackbar } from '../components/SnackbarProvider'

type PostFormNavProp = NativeStackNavigationProp<RootStackParamList, 'PostForm'>
type PostFormRouteProp = RouteProp<RootStackParamList, 'PostForm'>

export default function PostForm() {
  const navigation = useNavigation<PostFormNavProp>()
  const route = useRoute<PostFormRouteProp>()
  const snackbar = useSnackbar()
  const qc = useQueryClient()
  const id = route.params?.id

  const { data: post } = useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id!),
    enabled: !!id,
  })

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (post) {
      setTitle(post.title ?? '')
      setBody(post.body ?? '')
    }
  }, [post])

  const createMutation = useMutation({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      await qc.cancelQueries(['posts'] as any)
      const previousPosts = qc.getQueryData<any[]>(['posts'])
      qc.setQueryData<any[]>(['posts'], (old) => [
        { id: Math.random(), ...newPost },
        ...(old ?? []),
      ])
      return { previousPosts }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousPosts)
        qc.setQueryData<Post[]>(['posts'], context.previousPosts)
      snackbar({ message: 'Create failed', type: 'error' })
    },
    onSettled: () => qc.invalidateQueries(['posts'] as any),
    onSuccess: () => {
      snackbar({ message: 'Post created', type: 'success' })
      navigation.goBack()
    },
  }) as any

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) => updatePost(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries(['posts'] as any)
      const previousPosts = qc.getQueryData<Post[]>(['posts'])
      qc.setQueryData<Post[]>(
        ['posts'],
        (old) => old?.map((p) => (p.id === id ? { ...p, ...payload } : p)) ?? []
      )
      return { previousPosts }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousPosts)
        qc.setQueryData<Post[]>(['posts'], context.previousPosts)
      snackbar({ message: 'Update failed', type: 'error' })
    },
    onSettled: () => {
      qc.invalidateQueries(['posts'] as any)
      qc.invalidateQueries(['post', id] as any)
    },
    onSuccess: () => {
      snackbar({ message: 'Post updated', type: 'success' })
      navigation.goBack()
    },
  }) as any

  const onSave = () => {
    const payload: Partial<Post> = { title, body }
    if (!title.trim() || !body.trim()) {
      snackbar({ message: 'Title and Body are required', type: 'error' })
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
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
        />
        <HelperText type="error" visible={!title.trim()}>
          Title is required
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
          Body is required
        </HelperText>

        <Button
          mode="contained"
          onPress={onSave}
          style={{ marginTop: 20 }}
          loading={createMutation?.isPending || updateMutation?.isPending}
        >
          <Text> {createMutation.isPending ? 'Saving...' : 'Save'}</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}
