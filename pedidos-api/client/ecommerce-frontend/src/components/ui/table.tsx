export function Table({ children }: { children: React.ReactNode }) {
  return <table className="min-w-full border text-sm text-left">{children}</table>;
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-100 font-semibold">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr className="border-b hover:bg-gray-50">{children}</tr>;
}

export function TH({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2">{children}</th>;
}

export function TD({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className="px-4 py-2">{children}</td>;
}

