import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  Table as ReactTableType,
} from "@tanstack/react-table";

// Define the component props interface
interface DisplayTableProps<TData extends object> {
  data: TData[];
  column: ColumnDef<TData, any>[]; // column definitions
}

const DisplayTable = <TData extends object>({ data, column }: DisplayTableProps<TData>) => {
  // Initialize react-table
  const table = useReactTable<TData>({
    data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-black text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {/* Add serial number header */}
              <th className="border px-2 py-1 whitespace-nowrap">Sr. No</th>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border px-2 py-1 whitespace-nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {/* Sr. No column */}
              <td className="border px-2 py-1 text-center">{index + 1}</td>

              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-2 py-1 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="h-4" />
    </div>
  );
};

export default DisplayTable;
