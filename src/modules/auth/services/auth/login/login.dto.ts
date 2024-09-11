export interface IValidateUserDTO {
  email: string;
  password: string;
}

export type UserFiltered = {
  id: string;
  name: string;
  email: string;
};
