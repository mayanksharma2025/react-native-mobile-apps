import { createServer, Model } from 'miragejs'
import { User } from '../types';

export function makeServer() {
    // Make sure Mirage only runs once
    if ((global as any).server) return (global as any).server

    const server = createServer({
        models: {
            user: Model,
            post: Model,
            comment: Model,
        },

        seeds(server) {
            for (let i = 1; i <= 50; i++) {
                server.create('user', {
                    id: i.toString(),
                    name: `User ${i}`,
                    username: `user${i}`,
                    email: `user${i}@example.com`,
                })
            }
            server.create('post', {
                "id": "1",
                "title": "Hello World",
                "body": "This is my first post.",
                "userId": "1"
            })
            server.create('comment', { id: "1", name: 'John Doe', email: 'john@example.com', body: 'Nice post!', postId: "1" })
        },

        routes() {
            this.namespace = '/api'

            // Users
            // this.get('/users', (schema: any) => schema.users.all().models.map((u: any) => ({ id: u.id, ...u.attrs })))
            this.get('/users', (schema: any, request: any) => {
                const page = Number(request.queryParams.page || 1)
                const limit = Number(request.queryParams.limit || 10)
                const search = (request.queryParams.search || '').toLowerCase()

                let users = schema.users.all().models

                // Filter by search
                if (search) {
                    users = users.filter((u: any) =>
                        u.attrs.name.toLowerCase().includes(search)
                    )
                }

                const total = users.length
                const totalPages = Math.ceil(total / limit)
                const start = (page - 1) * limit
                const end = start + limit

                const paginated = users.slice(start, end)

                return {
                    data: paginated.map((u: any) => ({ id: u.id, ...u.attrs })),
                    page,
                    total,
                    totalPages,
                }
            })

            this.get('/users/:id', (schema: any, req) => {
                const user = schema.users.find(req.params.id)
                return user ? { id: user.id, ...user.attrs } : null
            })
            this.post('/users', (schema: any, req) => {
                const attrs = JSON.parse(req.requestBody)
                return schema.users.create(attrs)
            })
            this.put('/users/:id', (schema: any, req) => {
                const attrs = JSON.parse(req.requestBody)
                const user = schema.users.find(req.params.id)
                return user?.update(attrs)
            })
            this.del('/users/:id', (schema: any, req) => {
                schema.users.find(req.params.id)?.destroy()
                return {}
            })

            // Posts
            this.get('/posts', (schema: any) => schema.posts.all().models.map((p: any) => ({ id: p.id, ...p.attrs })))
            this.get('/posts/:id', (schema: any, req) => {
                const post = schema.posts.find(req.params.id)
                return post ? { id: post.id, ...post.attrs } : null
            })
            this.post('/posts', (schema: any, req) => schema.posts.create(JSON.parse(req.requestBody)))
            this.put('/posts/:id', (schema: any, req) => {
                const attrs = JSON.parse(req.requestBody)
                const post = schema.posts.find(req.params.id)
                return post?.update(attrs)
            })
            this.del('/posts/:id', (schema: any, req) => {
                schema.posts.find(req.params.id)?.destroy()
                return {}
            })

            // Comments
            this.get('/comments', (schema: any) => schema.comments.all().models.map((c: any) => ({ id: c.id, ...c.attrs })))
            this.get('/comments/:id', (schema: any, req) => {
                const comment = schema.comments.find(req.params.id)
                return comment ? { id: comment.id, ...comment.attrs } : null
            })
            this.post('/comments', (schema: any, req) => schema.comments.create(JSON.parse(req.requestBody)))
            this.put('/comments/:id', (schema: any, req) => {
                const attrs = JSON.parse(req.requestBody)
                const comment = schema.comments.find(req.params.id)
                return comment?.update(attrs)
            })
            this.del('/comments/:id', (schema: any, req) => {
                schema.comments.find(req.params.id)?.destroy()
                return {}
            })
        },
    });

    (global as any).server = server
    return server
}
