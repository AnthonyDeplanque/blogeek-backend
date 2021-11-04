import { Articles } from "./Articles";
import { Comments } from "./interactions/comments";
import { ArticleReactions, CommentReactions } from "./interactions/Reaction";
import { ROLE } from "./Role";

export interface Users {
  id: string;
  first_name?: string;
  last_name?: string;
  nick_name: string;
  email: string;
  hashed_password: string;
  inscription_time: number;
  avatar?: string;
  biography?: string;
  role?: ROLE[];
  articles?: Articles[];
  articles_reactions?: ArticleReactions[];
  comments?: Comments[];
  comments_reactions?: CommentReactions[];

}