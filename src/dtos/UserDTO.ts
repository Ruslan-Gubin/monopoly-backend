export interface CreatedUserDTO {
  fullName: string;
  email: string;
  password: string;
  imag: string;
}
export interface AuthorizationUserDTO {
  email: string;
  password: string;
}
export interface RemoveUserDTO {
  usersArrId: string[];
  userId: string;
  removeId: string;
}
export interface UpdateUserDTO {
  fullName: string;
  prevImag: string;
  imag: string;
  id: string;
}
export interface UserIdParamsDTO {
  id: string;
}
export interface UserUpdateAndImgDTO {
  prevImag: string;
  idAuth: string;
  fullName: string;
  newAvatar: string;
}
