interface ISessionMessageWs {
  message: string;
  method: string;
  id: string;
  owner?: string;
  fullName?: string;
  img?: string;
  body?: any
  joinSession?: string
}

export type { ISessionMessageWs };
