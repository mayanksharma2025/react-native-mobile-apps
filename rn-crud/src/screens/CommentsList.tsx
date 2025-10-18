import React from 'react'
import { FlatList, View, Text } from 'react-native'
import { Button, List } from 'react-native-paper'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query'
import { fetchComments, deleteComment } from '../api/queries'
import { Comment } from '../types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { useSnackbar } from '../components/SnackbarProvider'

type CommentsListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'CommentsList'
>

export default function CommentsList() {
  const navigation = useNavigation<CommentsListNavProp>()
  const snackbar = useSnackbar()
  const qc = useQueryClient()

  const { data: comments = [], isLoading } = useQuery<Comment[], Error>({
    queryKey: ['comments'],
    queryFn: fetchComments,
  })

  const deleteMutation: UseMutationResult<
    Comment,
    Error,
    number,
    { previousComments?: Comment[] }
  > = useMutation({
    mutationFn: deleteComment,
    onMutate: async (id: number) => {
      await qc.cancelQueries(['comments'] as any)
      const previousComments = qc.getQueryData<Comment[]>(['comments'])
      qc.setQueryData<Comment[]>(
        ['comments'],
        (old) => old?.filter((c) => c.id !== id) ?? []
      )
      return { previousComments }
    },
    onError: (_err, _id, context) => {
      if (context?.previousComments)
        qc.setQueryData<Comment[]>(['comments'], context.previousComments)
      snackbar({ message: 'Delete failed', type: 'error' })
    },
    onSettled: () => qc.invalidateQueries(['comments'] as any),
    onSuccess: () => snackbar({ message: 'Comment deleted', type: 'success' }),
  })

  return (
    <View style={{ flex: 1 }}>
      <Button
        mode="contained"
        style={{ margin: 10 }}
        onPress={() => navigation.navigate('CommentForm', {})}
      >
        Add Comment
      </Button>

      {comments.length === 0 && !isLoading && (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No comments found
        </Text>
      )}

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isLoading}
        onRefresh={() => qc.invalidateQueries(['comments'] as any)}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.body}
            right={() => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  compact
                  onPress={() =>
                    navigation.navigate('CommentForm', { id: item.id })
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
