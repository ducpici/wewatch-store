import { Role } from "./Role";

export type Position = {
  id: number;
  name: string;
  description: string;
  roles: Role[];
};
