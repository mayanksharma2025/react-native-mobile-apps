import axios from 'axios';
import { User, Post, Comment, PaginatedUsers, FetchUsersParams } from '../types';

// const BASE_URL = 'https://jsonplaceholder.typicode.com';
const BASE_URL = '/api';
// const BASE_URL = 'http://localhost:3000';

// USERS
// export const fetchUsers = async (): Promise<User[]> => {
//     const { data } = await axios.get(`${BASE_URL}/users`);
//     return data;
// };

// export async function fetchUsers({
//     page = 1,
//     limit = 10,
//     search = ''
// }: { page?: number; limit?: number; search?: string }) {
//     const params = new URLSearchParams({ page: String(page), limit: String(limit), search })
//     const res = await fetch(`/api/users?${params.toString()}`)
//     if (!res.ok) throw new Error('Failed to fetch users')
//     return res.json() // returns { data, page, totalPages }
// }


export const fetchUsers = async ({
    limit = 10,
    skip = 0,
    search = '',
}: FetchUsersParams): Promise<PaginatedUsers> => {
    const baseUrl = search
        ? 'https://dummyjson.com/users/search'
        : 'https://dummyjson.com/users'

    const searchQuery = search ? `&q=${encodeURIComponent(search)}` : ''
    const url = `${baseUrl}?limit=${limit}&skip=${skip}${searchQuery}`

    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.statusText}`)
    }

    const data: PaginatedUsers = await res.json()
    return data
}


export const fetchUser = async (id: number): Promise<User> => {
    const { data } = await axios.get(`${BASE_URL}/users/${id}`);
    return data;
};

export const createUser = async (payload: Partial<User>): Promise<User> => {
    const { data } = await axios.post(`${BASE_URL}/users`, payload);
    return data;
};

export const updateUser = async (id: number, payload: Partial<User>): Promise<User> => {
    const { data } = await axios.put(`${BASE_URL}/users/${id}`, payload);
    return data;
};

export const deleteUser = async (id: number): Promise<User> => {
    const { data } = await axios.delete(`${BASE_URL}/users/${id}`);
    return data;
};

// POSTS
export const fetchPosts = async (): Promise<Post[]> => {
    const { data } = await axios.get(`${BASE_URL}/posts`);
    return data;
};

export const fetchPost = async (id: number): Promise<Post> => {
    const { data } = await axios.get(`${BASE_URL}/posts/${id}`);
    return data;
};

export const createPost = async (payload: Partial<Post>): Promise<Post> => {
    const { data } = await axios.post(`${BASE_URL}/posts`, payload);
    return data;
};

export const updatePost = async (id: number, payload: Partial<Post>): Promise<Post> => {
    const { data } = await axios.put(`${BASE_URL}/posts/${id}`, payload);
    return data;
};

export const deletePost = async (id: number): Promise<Post> => {
    const { data } = await axios.delete(`${BASE_URL}/posts/${id}`);
    return data;
};

// COMMENTS
export const fetchComments = async (): Promise<Comment[]> => {
    const { data } = await axios.get(`${BASE_URL}/comments`);
    return data;
};

export const fetchComment = async (id: number): Promise<Comment> => {
    const { data } = await axios.get(`${BASE_URL}/comments/${id}`);
    return data;
};

export const createComment = async (payload: Partial<Comment>): Promise<Comment> => {
    const { data } = await axios.post(`${BASE_URL}/comments`, payload);
    return data;
};

export const updateComment = async (id: number, payload: Partial<Comment>): Promise<Comment> => {
    const { data } = await axios.put(`${BASE_URL}/comments/${id}`, payload);
    return data;
};

export const deleteComment = async (id: number): Promise<Comment> => {
    const { data } = await axios.delete(`${BASE_URL}/comments/${id}`);
    return data;
};
