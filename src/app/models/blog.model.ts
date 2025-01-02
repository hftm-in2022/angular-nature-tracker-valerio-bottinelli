export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;
  tags: string[] | string;
  allowComments: boolean;
  allowLikes: boolean;
  likes: number;
}
