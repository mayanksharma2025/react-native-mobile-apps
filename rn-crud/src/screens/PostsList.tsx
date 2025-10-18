import React from 'react'
import { FlatList, View, Text } from 'react-native'
import { Button, List } from 'react-native-paper'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query'
import { fetchPosts, deletePost } from '../api/queries'
import { Post } from '../types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { useSnackbar } from '../components/SnackbarProvider'

type PostsListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'PostsList'
>

export default function PostsList() {
  const navigation = useNavigation<PostsListNavProp>()
  const snackbar = useSnackbar()
  const qc = useQueryClient()

  const { data: posts = [], isLoading } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  const deleteMutation: UseMutationResult<
    Post,
    Error,
    number,
    { previousPosts?: Post[] }
  > = useMutation({
    mutationFn: deletePost,
    onMutate: async (id: number) => {
      await qc.cancelQueries(['posts'] as any)
      const previousPosts = qc.getQueryData<any[]>(['posts'])
      qc.setQueryData<Post[]>(
        ['posts'],
        (old) => old?.filter((p) => p.id !== id) ?? []
      )
      return { previousPosts }
    },
    onError: (_err, _id, context) => {
      if (context?.previousPosts)
        qc.setQueryData<Post[]>(['posts'], context.previousPosts)
      snackbar({ message: 'Delete failed', type: 'error' })
    },
    onSettled: () => qc.invalidateQueries(['posts'] as any),
    onSuccess: () => snackbar({ message: 'Post deleted', type: 'success' }),
  })

  return (
    <View style={{ flex: 1 }}>
      <Button
        mode="contained"
        style={{ margin: 10 }}
        onPress={() => navigation.navigate('PostForm', {})}
      >
        Add Post
      </Button>

      {posts.length === 0 && !isLoading && (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No posts found
        </Text>
      )}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isLoading}
        onRefresh={() => qc.invalidateQueries(['posts'] as any)}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.body}
            right={() => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  compact
                  onPress={() =>
                    navigation.navigate('PostForm', { id: item.id })
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
