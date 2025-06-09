// src/ui/composite/DataTable.jsx
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function DataTable({
  columns = [], data = [], onEdit, onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="whitespace-nowrap px-3 py-2 text-left">
                {c.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="w-20" />}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="flex justify-end gap-2 px-3 py-2">
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="text-blue-500">
                      <FiEdit />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} className="text-red-500">
                      <FiTrash2 />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
