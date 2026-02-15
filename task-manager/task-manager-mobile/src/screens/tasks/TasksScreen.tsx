import React, { useState } from "react";
import { View, ScrollView, RefreshControl, Alert } from "react-native";
import { ListItem, Button, Icon, Text } from "react-native-elements";
import { useTasks, useDeleteTask } from "../../hooks/useTasks";
import { ITask } from "../../types/task.types";
import { useNavigation } from "@react-navigation/native";

const TasksScreen: React.FC = () => {
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const navigation = useNavigation<any>();

  const {
    data: tasks,
    isLoading,
    isFetching,
    refetch,
  } = useTasks(limit, offset);
  const deleteTaskMutation = useDeleteTask(limit, offset);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(id);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      {/* Screen Title */}
      <Text
        h4
        style={{ textAlign: "center", marginVertical: 16, fontWeight: "bold" }}
      >
        My Tasks
      </Text>

      {isLoading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : tasks && tasks.length > 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {tasks.map((task: ITask, index) => (
            <ListItem key={task.id.toString()} bottomDivider>
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
                  navigation
                    .getParent()
                    ?.navigate("CreateTask", { taskId: task.id })
                }
              />
              <Button
                icon={{ name: "delete", type: "material", color: "#fff" }}
                buttonStyle={{ backgroundColor: "red" }}
                onPress={() => handleDelete(task.id)}
              />
            </ListItem>
          ))}
        </ScrollView>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No tasks found
        </Text>
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
