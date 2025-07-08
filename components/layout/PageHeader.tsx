import { ReactNode } from "react";

interface PageHeaderProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({
  icon,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3">
        {icon && (
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>

      {action && (
        <div className="sm:shrink-0 w-full sm:w-auto">{action}</div>
      )}
    </div>
  );
}
