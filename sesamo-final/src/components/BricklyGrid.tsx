import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// Registra i moduli AG Grid (v33+ compatibile)
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface BricklyGridProps extends AgGridReactProps {
  id: string;
}

const BricklyGrid = ({ id, columnDefs = [], ...props }: BricklyGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [search, setSearch] = useState("");

  const userPrefs = JSON.parse(localStorage.getItem("gridPrefs") || "{}");

  const {
    theme = "quartz",
    pageSize = 20,
    altRow = "#f9f9f9",
  } = userPrefs;

  const defaultTheme = `ag-theme-${theme}`;

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };

  const handleExport = () => {
    gridRef.current?.api.exportDataAsCsv();
  };

  const handleClearFilters = () => {
    gridRef.current?.api.setFilterModel(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    gridRef.current?.api.setQuickFilter(val);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          placeholder="🔍 Cerca in tutti i campi..."
          value={search}
          onChange={handleSearch}
          className="border px-2 py-1 rounded w-1/2 text-sm"
        />
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            📤 Esporta CSV
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
          >
            🧹 Cancella Filtri
          </button>
        </div>
      </div>

      <div className={defaultTheme} style={{ width: "100%", height: "100%", fontSize: "12px" }}>
        <AgGridReact
          ref={gridRef}
          domLayout="autoHeight"
          rowHeight={28}
          pagination={true}
          paginationPageSize={pageSize}
          suppressRowClickSelection={true}
          suppressColumnVirtualisation={false}
          getRowStyle={(params) =>
            params.node.rowIndex % 2 === 0 ? { backgroundColor: altRow } : {}
          }
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          {...props}
        />
      </div>
    </div>
  );
};

export default BricklyGrid;