import React, { useCallback } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { usePublicTasksInfinite } from "../../hooks/useTasks";
import { ITask } from "../../types/task.types";

const PublicTasksScreen: React.FC = () => {
  const limit = 10;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isFetching,
  } = usePublicTasksInfinite(limit);

  const tasks: ITask[] = (data as any)?.pages.flat() ?? [];

  const renderItem = useCallback(
    ({ item }: { item: ITask }) => (
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>
            {item.description ?? "No description"}
          </ListItem.Subtitle>
          <Text>Status: {item.status}</Text>
          <Text>Priority: {item.priority}</Text>
        </ListItem.Content>
      </ListItem>
    ),
    [],
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <Text
        h4
        style={{ textAlign: "center", marginVertical: 16, fontWeight: "bold" }}
      >
        Public Tasks
      </Text>
      {/* <View>{JSON.stringify(tasks, null, 2)}</View> */}

      {isLoading && tasks.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : tasks.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No tasks available
        </Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Text style={{ textAlign: "center", marginVertical: 10 }}>
                Loading more...
              </Text>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        />
      )}
    </View>
  );
};

export default PublicTasksScreen;
