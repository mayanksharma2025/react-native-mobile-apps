export interface Post {
  id: string;

  title: string;

  content: string;

  authorId: string;

  isPublic: boolean;

  createdAt: number;

  updatedAt: number;
}

export interface CreatePostDto {
  title: string;

  content: string;

  authorId: string;

  isPublic?: boolean;
}

export interface UpdatePostDto {
  title?: string;

  content?: string;

  isPublic?: boolean;
}

export interface IPostRepo {
  create(post: CreatePostDto): Promise<Post>;

  getById(id: string): Promise<Post | null>;

  update(id: string, data: UpdatePostDto): Promise<Post>;

  delete(id: string): Promise<void>;

  listByAuthor(authorId: string): Promise<Post[]>;

  listAllPublic(): Promise<Post[]>;
}
