interface OperationSummaryProps {
  user?: string;
  operationType?: string;
  date?: string;
  currency?: string;
  amount?: string;
  state?: string;
}

function OperationSummary({ user, operationType, date, currency = "BS", amount, state }: OperationSummaryProps) {
  return (
    <div className="flex w-full justify-between rounded-lg border-l-8 border-blue-700 bg-white p-2 drop-shadow-md">
      <div className="flex h-full items-center space-x-4">
        <div className="flex aspect-square size-14 items-center justify-center rounded-full bg-slate-100 p-2 drop-shadow">
          <span className="text-2xl font-bold">DS</span>
        </div>
        <div className="flex flex-col space-y-1 text-xs font-light text-slate-500">
          <span>{operationType}</span>
          <span className="text-[1.2em] font-normal text-slate-800">{user}</span>
          <span>{date}</span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center">
        <div className="text-sm font-semibold">
          {currency} {amount}
        </div>
        <div className="text-xs font-semibold text-green-600">{state}</div>
      </div>
    </div>
  );
}

export default OperationSummary;
