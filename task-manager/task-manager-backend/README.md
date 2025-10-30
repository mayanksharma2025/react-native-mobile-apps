src/
┣ models/
┃ ┣ Project.ts
┃ ┣ Comment.ts
┃ ┣ Notification.ts
┃ ┗ Activity.ts
┣ graphql/
┃ ┗ typeDefs.ts (updated)
┃ ┗ resolvers.ts (updated)

query {
projects {
id
name
description
members { name }
tasks { title }
}
}

✅ 7. Example Queries for Playground
➤ Create a Project
mutation {
createProject(name: "Task Manager v2", description: "Upgraded version") {
id
name
members { name }
}
}

➤ Add Task to Project
mutation {
addTaskToProject(projectId: "PROJECT_ID", taskId: "TASK_ID") {
id
name
tasks { title }
}
}

➤ Add Member to Project
mutation {
addMemberToProject(projectId: "PROJECT_ID", userId: "USER_ID") {
id
name
members { name email }
}
}

➤ Add Comment
mutation {
addComment(taskId: "TASK_ID", content: "Please finish this soon!") {
id
content
author { name }
}
}

➤ Get Comments
query {
comments(taskId: "TASK_ID") {
content
author { name }
}
}

➤ Notifications
query {
notifications {
id
message
read
}
}

➤ Mark Notification as Read
mutation {
markNotificationRead(id: "NOTIFICATION_ID") {
id
message
read
}
}

➤ Get Activity Logs
query {
activities(limit: 5) {
action
user { name }
entityType
details
createdAt
}
}

🧪 Test Queries in Playground
➤ Get a Project
query {
getProject(id: "PROJECT_ID") {
id
name
description
members { name }
tasks { title }
}
}

➤ Edit Project
mutation {
updateProject(id: "PROJECT_ID", name: "Updated Project", description: "Now improved!") {
id
name
description
}
}

➤ Delete Project
mutation {
deleteProject(id: "PROJECT_ID")
}

➤ Get Comment
query {
getComment(id: "COMMENT_ID") {
id
content
author { name }
}
}

➤ Edit Comment
mutation {
updateComment(id: "COMMENT_ID", content: "Updated comment text") {
id
content
}
}

➤ Delete Comment
mutation {
deleteComment(id: "COMMENT_ID")
}

➤ Get Notification
query {
getNotification(id: "NOTIF_ID") {
id
message
read
}
}

➤ Delete Notification
mutation {
deleteNotification(id: "NOTIF_ID")
}

➤ Get Activity
query {
getActivity(id: "ACTIVITY_ID") {
id
action
details
user { name }
}
}

➤ Delete Activity (Admin Only)
mutation {
deleteActivity(id: "ACTIVITY_ID")
}

As a normal user:
mutation {
updateUser(name: "Updated Alice", password: "newpass123") {
id
name
email
role
}
}

As an admin (update another user):

mutation {
updateUser(id: "671fb62a6d5e..." role: "admin" name: "Promoted Bob") {
id
name
role
}
}

🔸 Change user role (admin only)
mutation {
changeUserRole(id: "6901fd99c91d64118e9819b1", role: "admin") {
id
name
email
role
}
}
