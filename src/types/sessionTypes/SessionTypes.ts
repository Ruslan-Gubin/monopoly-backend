interface ISession {
  owner: string;
  players: { id: string, fullName: string, img: string }[]
  _doc: ISession;
}

export type { ISession }