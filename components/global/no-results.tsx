import { SearchX } from "lucide-react";

interface NoResultsProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function NoResults({
  title = "No encontramos vehículos",
  description = "Intenta ajustar los filtros para ver más resultados.",
  onReset,
}: NoResultsProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <SearchX className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-[#111111] mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#111111] rounded-lg hover:bg-[#333333] transition-colors cursor-pointer"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
