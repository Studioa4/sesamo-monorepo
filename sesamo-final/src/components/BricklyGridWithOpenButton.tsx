
import { AgGridReact } from "ag-grid-react";
import { useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

interface BricklyGridProps {
  id: string;
  rowData: any[];
  columnDefs: any[];
  onOpenVarco?: (row: any) => void;
}

const BricklyGrid = ({ id, rowData, columnDefs, onOpenVarco }: BricklyGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [search, setSearch] = useState("");

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };

  const colDefs = [
    ...columnDefs,
    {
      headerName: "Azione",
      field: "azione",
      cellRenderer: (params: any) => {
        return (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
            onClick={() => onOpenVarco?.(params.data)}
          >
            🔓 Apri
          </button>
        );
      },
      flex: 1,
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    gridRef.current?.api.setQuickFilter(e.target.value);
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
      </div>

      <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          domLayout="autoHeight"
          rowHeight={28}
          pagination={true}
          paginationPageSize={20}
          suppressRowClickSelection={true}
          suppressColumnVirtualisation={false}
          getRowStyle={(params) =>
            params.node.rowIndex % 2 === 0 ? { backgroundColor: "#f9f9f9" } : {}
          }
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};

export default BricklyGrid;
