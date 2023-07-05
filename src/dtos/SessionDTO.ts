export interface SessionConnectDTO {
  fullName: string;
  id: string;
  method: string;
}

export interface SessionCreateDTO {
  method: string;
  owner: string;
  fullName: string;
  img: string;
  id: string;
}

export interface SessionRemoveDTO extends SessionConnectDTO {}

export interface SessionJoinBodyDTO {
  sessionId: string;
  id: string;
  fullName: string;
  img: string;
}

export interface SessionJoinDTO {
  method: string;
  body: SessionJoinBodyDTO;
}

export interface SessionOutBodyDTO {
  sessionId: string;
  playerId: string;
}

export interface SessionOutDTO {
  method: string;
  body: SessionOutBodyDTO;
}

export interface SessionDisconectBodyDTO {
  fullName: string;
  id: string;
  joinSession: string;
  owner: string;
}

export interface SessionDisconectUserDTO {
  method: string;
  body: SessionDisconectBodyDTO;
}

export interface SessionCreateMessageDTO {
  method: string;
  body: {
    text: string;
    authorId: string;
    fullName: string;
    image: string;
  };
}

export interface SessionStartConfirmationDTO {
  method: string;
  body: { sessionId: string };
}

export interface SessionConfirmParticipationDTO {
  method: string;
  body: {
    authId: string;
    sessionId: string;
  };
}

export interface SessionCancelParticipationDTO {
  method: string;
  body: {
    authId: string;
    sessionId: string;
    authName: string;
  };
}
