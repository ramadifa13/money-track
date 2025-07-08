export interface Transaction {
  id: string
  note: string | null
  amount: number
  type: "income" | "expense"
  date: string 
  category?: {
    id: string
    name: string
  } | null
}