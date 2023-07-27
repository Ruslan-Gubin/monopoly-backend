export interface StartConfirmationDTO {
   sessionId: string 
}
export interface ConfirmGameDTO extends StartConfirmationDTO {
  authId: string
  color: string
}
export interface CancelParticipationGameDTO extends StartConfirmationDTO {
  authName: string 
  authId: string
}