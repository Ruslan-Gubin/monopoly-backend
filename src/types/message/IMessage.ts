export interface IMessage {
  _id: string;
  text: string;
  createdAt: string;
  authorId: string;
  fullName: string;
  image: { 
    public_id: string;
    url: string;
   }
}



export interface MessageCreateReq {
  text: string;
  authorId: string;
  fullName: string;
  image: string;
}
