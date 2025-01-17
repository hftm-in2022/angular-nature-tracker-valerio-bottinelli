export interface Blog { // bitte die Typen dort definieren wo sie benutzt werden. Bitte type alias verwenden anstelle Interfaces
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
  comments: number;
  read: number;
}
