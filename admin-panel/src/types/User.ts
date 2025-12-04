import type { Dayjs } from "dayjs";
export type User = {
  id: number;
  name: string;
  dob: Dayjs | string;
  gender: number;
  email: string;
  address: string;
  phone_number: string;
  username: string;
  password: string;
  state: boolean | string;
};
