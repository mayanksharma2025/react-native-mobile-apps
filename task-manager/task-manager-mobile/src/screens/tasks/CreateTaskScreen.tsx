import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCreateTask, useUpdateTask, useTasks } from "../../hooks/useTasks";
import { AuthContext } from "../../context/AuthContext";
import { IUser } from "../../types/auth.types";
import { ITask } from "../../types/task.types";

const TaskFormScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user }: { user: IUser } = useContext(AuthContext);

  const taskId = route.params?.taskId;
  const limit = 10;
  const offset = 0;

  // Fetch tasks if editing
  const { data: tasks } = useTasks(limit, offset, user.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    "pending",
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [banner, setBanner] = useState("");

  const createTaskMutation = useCreateTask(limit, offset, user.id);
  const updateTaskMutation = useUpdateTask(limit, offset, user.id);

  // Pre-fill form if editing
  useEffect(() => {
    if (taskId && tasks) {
      const taskToEdit = tasks.find((t: ITask) => t.id === taskId);
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description ?? "");
        setStatus(taskToEdit.status);
        setPriority(taskToEdit.priority);
        setBanner(taskToEdit.banner ?? "");
      }
    }
  }, [taskId, tasks]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    const taskInput = {
      title,
      description,
      status,
      priority,
      banner: banner || undefined,
      createdBy: (user as any)._id,
    };

    try {
      if (taskId) {
        // Edit existing task
        await updateTaskMutation.mutateAsync({ id: taskId, input: taskInput });
        Alert.alert("Success", "Task updated successfully");
      } else {
        // Create new task
        await createTaskMutation.mutateAsync(taskInput);
        Alert.alert("Success", "Task created successfully");
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        multiline
      />

      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={status}
        onValueChange={(value) => setStatus(value as any)}
        style={styles.picker}
      >
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="In Progress" value="in-progress" />
        <Picker.Item label="Completed" value="completed" />
      </Picker>

      <Text style={styles.label}>Priority</Text>
      <Picker
        selectedValue={priority}
        onValueChange={(value) => setPriority(value as any)}
        style={styles.picker}
      >
        <Picker.Item label="Low" value="low" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="High" value="high" />
      </Picker>

      <Text style={styles.label}>Banner URL (optional)</Text>
      <TextInput
        style={styles.input}
        value={banner}
        onChangeText={setBanner}
        placeholder="Enter banner URL"
      />

      <Button
        title={taskId ? "Update Task" : "Create Task"}
        onPress={handleSubmit}
        loading={
          taskId ? updateTaskMutation.isPending : createTaskMutation.isPending
        }
        containerStyle={{ marginTop: 20 }}
      />
    </ScrollView>
  );
};

export default TaskFormScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
});
