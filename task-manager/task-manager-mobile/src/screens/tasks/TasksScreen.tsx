import React, { useCallback } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { ListItem, Button, Icon, Text } from "react-native-elements";
import { useTasksInfinite, useDeleteTask } from "../../hooks/useTasks";
import { ITask } from "../../types/task.types";
import { useNavigation } from "@react-navigation/native";

const TasksScreen: React.FC = () => {
  const limit = 10;
  const navigation = useNavigation<any>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isFetching,
  } = useTasksInfinite(limit);

  const deleteTaskMutation = useDeleteTask(limit, 0); // offset not needed for infinite query

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(id);
    }
  };

  // Flatten all pages into a single array
  const tasks: ITask[] = (data as any)?.pages.flat() ?? [];

  // Render each task item
  const renderItem = useCallback(
    ({ item: task }: { item: ITask }) => (
      <ListItem key={task.id} bottomDivider>
        <Icon name="task" type="material" />
        <ListItem.Content>
          <ListItem.Title>{task.title}</ListItem.Title>
          <ListItem.Subtitle>
            {task.description ?? "No description"}
          </ListItem.Subtitle>
          <Text>Status: {task.status}</Text>
          <Text>Priority: {task.priority}</Text>
        </ListItem.Content>
        <Button
          icon={{ name: "edit", type: "material", color: "#fff" }}
          buttonStyle={{ backgroundColor: "#4caf50", marginRight: 5 }}
          onPress={() =>
            navigation.getParent()?.navigate("CreateTask", { taskId: task.id })
          }
        />
        <Button
          icon={{ name: "delete", type: "material", color: "#fff" }}
          buttonStyle={{ backgroundColor: "red" }}
          onPress={() => handleDelete(task.id)}
        />
      </ListItem>
    ),
    [navigation],
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <Text
        h4
        style={{ textAlign: "center", marginVertical: 16, fontWeight: "bold" }}
      >
        My Tasks
      </Text>

      {isLoading && tasks.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : tasks.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No tasks found
        </Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5} // Load more when scrolled 50% from bottom
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

      <Button
        title="Create Task"
        icon={{ name: "add", color: "#fff" }}
        containerStyle={{ marginVertical: 16 }}
        onPress={() => navigation.navigate("CreateTask")}
      />
    </View>
  );
};

export default TasksScreen;
