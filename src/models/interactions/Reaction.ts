export enum REACTIONS {
  REACTION_PLUS = "REACTION_PLUS",
  REACTION_MINUS = "REACTION_MINUS",
  REACTION_SMILE = "REACTION_SMILE",
  REACTION_FROWN = "REACTION_FROWN",
  REACTION_LOVE = "REACTION_LOVE",
  REACTION_ANGRY = "REACTION_ANGRY",
}

export interface Reactions {
  id: string,
  name?: REACTIONS,
}

export interface UserReactions extends Reactions {
  id_user?: string,
}

export interface ArticleReactions extends UserReactions {
  id_article?: string,
}

export interface CommentReactions extends UserReactions {
  id_comment?: string,
}