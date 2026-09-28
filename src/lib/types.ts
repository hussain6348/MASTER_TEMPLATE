export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderRecord {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: string;
  total: number;
  notes: string | null;
  status: string;
  created_at: string;
}
