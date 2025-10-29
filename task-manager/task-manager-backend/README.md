backend/
┣ src/
┃ ┣ config/
┃ ┃ ┗ db.ts
┃ ┣ models/
┃ ┃ ┣ User.ts
┃ ┃ ┗ Task.ts
┃ ┣ graphql/
┃ ┃ ┣ typeDefs.ts
┃ ┃ ┗ resolvers.ts
┃ ┣ middleware/
┃ ┃ ┗ auth.ts
┃ ┣ utils/
┃ ┃ ┗ generateToken.ts
┃ ┣ index.ts
┗ tsconfig.json
┗ package.json

⚙️ tsconfig.json

{
"compilerOptions": {
"target": "ES2020",
"module": "CommonJS",
"outDir": "dist",
"rootDir": "src",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true,
"resolveJsonModule": true
}
}

Run your backend:

npm run dev

Then open:

http://localhost:4000/graphql

✅ Auth Header

After logging in or registering, you’ll get a token (JWT).
Use it in headers for authenticated queries:

{
"Authorization": "Bearer YOUR_TOKEN_HERE"
}

👤 1. Register a User
mutation {
register(name: "Alice", email: "alice@example.com", password: "password123") {
token
user {
id
name
email
role
}
}
}

💡 Save the token — you’ll need it for authenticated actions.

🔑 2. Login
mutation {
login(email: "alice@example.com", password: "password123") {
token
user {
id
name
email
role
}
}
}

🧭 3. Get Current User (me)
query {
me {
id
name
email
role
}
}

🧱 4. Create a Task

Auth required (user or admin)

mutation {
createTask(
input: {
title: "Finish GraphQL Backend"
description: "Implement CRUD, filters, and pagination"
status: "in-progress"
priority: "high"
banner: "🔥 Important Task"
}
) {
id
title
status
priority
banner
createdBy {
name
email
}
}
}

🔄 5. Update a Task

Auth required — only the task owner or admin can update.

mutation {
updateTask(
id: "TASK_ID_HERE"
input: {
title: "Finish GraphQL Backend ASAP"
status: "in-progress"
priority: "high"
}
) {
id
title
status
priority
}
}

❌ 6. Delete Your Own Task

Auth required — only task creator can delete.

mutation {
deleteTask(id: "TASK_ID_HERE")
}

Returns true if deleted.

🛡️ 7. Admin Delete Task

Auth required — admin only.

mutation {
adminDeleteTask(id: "TASK_ID_HERE")
}

📋 8. Get Tasks (With Pagination, Filter, and Search)

Auth required (any logged-in user).

➤ Basic pagination:
query {
tasks(limit: 5, offset: 0) {
tasks {
id
title
status
priority
banner
createdBy {
name
}
}
totalCount
hasMore
}
}

➤ Filter by Status and Priority:
query {
tasks(status: "pending", priority: "high", limit: 10, offset: 0) {
tasks {
id
title
status
priority
}
totalCount
hasMore
}
}

➤ Search by Title:
query {
tasks(search: "backend", limit: 5, offset: 0) {
tasks {
id
title
description
}
totalCount
hasMore
}
}

➤ Infinite Scroll Example

(simulate fetching next batch)

query {
tasks(limit: 5, offset: 5) {
tasks {
id
title
}
hasMore
}
}

🌟 9. Admin-Only Actions

If you have an admin user (role = "admin"), you can:

View and delete all tasks

Potentially extend backend with more admin mutations, e.g.:

mutation {
promoteUser(email: "bob@example.com") {
id
name
role
}
}

(You can add that later.)

⚡ Quick Admin Creation Tip

To make an admin user quickly, update directly in Mongo shell:

db.users.updateOne({ email: "alice@example.com" }, { $set: { role: "admin" } })

Then re-login to get a new token reflecting the admin role.

🧪 Optional Testing Sequence

Register or login → copy token

me query → confirm login works

Create a few tasks with different status and priority

Fetch with filters and search

Try updating/deleting tasks

Switch to admin → test adminDeleteTask
