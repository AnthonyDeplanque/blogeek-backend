export interface PrivateMessage {
  id: string;
  id_user_sender: string;
  id_user_receiver: string;
  is_read: boolean;
  date_of_write: number;
  content: string;
}