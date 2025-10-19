export interface User {
    id: number;
    name: string;
    username?: string;
    email: string;
}

export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

export interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
}
export type FetchUsersParams = {
    limit?: number
    skip?: number
    search?: string
}

export interface PaginatedUsers {
    users: User[]
    total: number
    skip: number
    limit: number
}

