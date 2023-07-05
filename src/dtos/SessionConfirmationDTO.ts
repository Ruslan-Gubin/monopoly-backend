export interface StartConfirmationDTO {
   sessionId: string 
}
export interface ConfirmGameDTO extends StartConfirmationDTO {
  authId: string 
}
export interface CancelParticipationGameDTO extends ConfirmGameDTO {
  authName: string 
}