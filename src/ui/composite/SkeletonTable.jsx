// File: src/ui/composite/SkeletonTable.jsx
export default function SkeletonTable({ rows = 10 }) {
  return (
    <div className="animate-pulse border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 border-b bg-gray-100" />
      ))}
    </div>
  );
}
