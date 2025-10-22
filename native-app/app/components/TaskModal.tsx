// Import necessary components from react-native
import {
  View, // Container component for layout
  Text, // Component for displaying text
  TextInput, // Input field for text
  Button, // Button component
  Modal, // Modal dialog component
} from 'react-native'
// Import styles from the styles file
import styles from './styles'
// Import Calendar component for date picking
import { Calendar } from 'react-native-calendars'

// Define the TaskModal functional component with props
const TaskModal = ({
  modalVisible, // Boolean to control modal visibility
  task, // Task object containing title, description, deadline, etc.
  setTask, // Function to update the task state
  handleAddTask, // Function to handle adding or updating a task
  handleCancel, // Function to handle cancel action
  validationError, // Boolean to indicate validation error
}) => {
  return (
    // Modal component to display the task form
    <Modal
      visible={modalVisible} // Show or hide modal based on modalVisible
      animationType="slide" // Slide animation for modal appearance
      transparent={false}
    >
      {/* Modal is not transparent */}
      {/* Container for modal content */}
      <View style={styles.modalContainer}>
        {/* Input for task title */}
        <TextInput
          style={styles.input} // Style for input
          placeholder="Title" // Placeholder text
          value={task.title} // Value from task object
          onChangeText={(
            text // Update task title on change
          ) => setTask({ ...task, title: text })}
        />
        {/* Input for task description */}
        <TextInput
          style={styles.input} // Style for input
          placeholder="Description" // Placeholder text
          value={task.description} // Value from task object
          onChangeText={(
            text // Update task description on change
          ) =>
            setTask({
              ...task,
              description: text,
            })
          }
        />
        {/* Label for deadline */}
        <Text style={styles.inputLabel}>Deadline:</Text>
        {/* Calendar component for selecting deadline */}
        <Calendar
          style={(styles as any).datePicker} // Style for calendar
          markedDates={
            // Highlight selected date
            task.deadline
              ? {
                  [task.deadline]: { selected: true, selectedColor: '#007BFF' },
                }
              : {}
          }
          onDayPress={(
            day // Update deadline on date selection
          ) => setTask({ ...task, deadline: day.dateString })}
          current={task.deadline} // Set current date in calendar
        />
        {/* Show validation error if present */}
        {validationError && (
          <Text style={styles.errorText}>
            Please fill in all fields correctly.
          </Text>
        )}
        {/* Button to add or update task */}
        <Button
          title={task.id ? 'Update' : 'Add'} // Show "Update" if editing, else "Add"
          onPress={handleAddTask} // Call handleAddTask on press
          color="#007BFF"
        />
        {/* Button color */}
        {/* Button to cancel and close modal */}
        <Button
          title="Cancel" // Button label
          onPress={handleCancel} // Call handleCancel on press
          color="#FF3B30"
        />
        {/* Button color */}
      </View>
    </Modal>
  )
}

// Export the TaskModal component as default
export default TaskModal
