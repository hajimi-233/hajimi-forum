export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
};

export type PostWithRelations = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
};

export type CommentWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
};

export type NotificationWithLink = {
  id: string;
  type: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: Date;
};
