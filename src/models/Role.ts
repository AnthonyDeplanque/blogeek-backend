/* eslint-disable no-unused-vars */
export enum ROLE {
  ROLE_USER = "ROLE_USER", // can chat, no creation, no moderation.
  ROLE_MODERATOR = "ROLE_MODERATOR", // chat and content moderation, no creation.
  ROLE_CREATOR = "ROLE_CREATOR", // no moderation, content creation.
  ROLE_ADMIN = "ROLE_ADMIN", // all of the above + delete accounts and sets roles.
  ROLE_MUTED = "ROLE_MUTED", // Can not post a comment.
}
export interface Roles {
  id: string;
  name: ROLE;
}
