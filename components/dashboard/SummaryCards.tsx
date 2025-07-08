import { Card, CardContent } from "@/components/ui/card"

export default function SummaryCards({
  data,
}: {
  data: { balance: number; income: number; expense: number } | null
}) {
  if (!data) return <p className="text-red-500">Gagal mengambil data summary.</p>

  const { balance, income, expense } = data

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
      <Card className="bg-green-50 border-green-100">
        <CardContent className="py-4 px-4">
          <p className="text-sm text-green-700 font-medium">Saldo</p>
          <h2 className="text-lg font-bold text-green-900">
            Rp {balance.toLocaleString("id-ID")}
          </h2>
        </CardContent>
      </Card>
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="py-4 px-4">
          <p className="text-sm text-blue-700 font-medium">Pemasukan</p>
          <h2 className="text-lg font-bold text-blue-900">
            Rp {income.toLocaleString("id-ID")}
          </h2>
        </CardContent>
      </Card>
      <Card className="bg-red-50 border-red-100">
        <CardContent className="py-4 px-4">
          <p className="text-sm text-red-700 font-medium">Pengeluaran</p>
          <h2 className="text-lg font-bold text-red-900">
            Rp {expense.toLocaleString("id-ID")}
          </h2>
        </CardContent>
      </Card>
    </div>
  )
}
