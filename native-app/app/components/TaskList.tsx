// Import the ScrollView component from react-native for scrollable content
import { ScrollView } from 'react-native'
// Import the TaskItem component to render individual tasks
import TaskItem from './TaskItem'
// Import styles from the styles file
import styles from './styles'

// Define the TaskList functional component with props for tasks and handlers
const TaskList = ({
  tasks, // Array of task objects to display
  handleEditTask, // Function to handle editing a task
  handleToggleCompletion, // Function to toggle task completion status
  handleDeleteTask, // Function to delete a task
}) => {
  // Render the component
  return (
    // Scrollable container for the list of tasks, styled with taskList style
    <ScrollView style={styles.taskList}>
      {/* Iterate over each task in the tasks array */}
      {tasks.map((t) => (
        // Render a TaskItem component for each task
        <TaskItem
          key={t.id} // Unique key for each TaskItem using task's ID
          task={t} // Pass the entire task object as a prop
          handleEditTask={handleEditTask} // Pass edit handler function
          handleToggleCompletion={handleToggleCompletion} // Pass toggle completion handler
          handleDeleteTask={handleDeleteTask} // Pass delete handler function
        />
      ))}
    </ScrollView>
  )
}
// Export the TaskList component as the default export
export default TaskList
