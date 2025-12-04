import type { Dayjs } from "dayjs";
export interface Employee {
  id: number;
  name: string;
  dob: Dayjs | string;
  gender: number;
  email: string;
  address: string;
  phone_number: string;
  position: {
    id: number;
    name: string;
    description: string;
  };
  username: string;
  password: string;
  state: boolean | string;
}
