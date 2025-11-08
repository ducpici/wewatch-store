type User = {
  id: BigInt;
  name: string;
  dob: string;
  gender: string;
  email: string;
  address: string;
  phone_number: string;
  username: string;
  password: string;
  state: boolean;
};

type Account = {
  old_pass: string;
  new_pass: string;
};

type Address = {
  id_ship: number;
  user_id: number;
  full_name: string;
  phone_num: string;
  city: string;
  district: string;
  ward: string;
  detail: string;
  is_default: boolean;
};

export type { Address, User, Account };
