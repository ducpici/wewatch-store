export type Voucher = {
  id: number;
  code: string;
  description: string;
  quantity: number;
  used_count: number;
  discount_type: {
    code: number;
    text: string;
  };
  discount_value: bigint;
  start_date: string;
  end_date: string;
  create_at: Date;
  update_at: Date;
};
