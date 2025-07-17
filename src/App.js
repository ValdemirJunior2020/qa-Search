import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AgentSearch from "./components/AgentSearch";
import AgentTable from "./components/AgentTable";
import "bootstrap/dist/css/bootstrap.min.css";

const SHEETS = [
  { name: "BUW", label: "Buwelo" },
  { name: "WNS", label: "WNS" },
  { name: "TEP", label: "TEP" },
  { name: "CON", label: "Concentrix" },
];

// ✅ Your Google Sheets API Key
const API_KEY = "AIzaSyDtVQ6fgbzJNEJW9IVYRkaoB-0-NhD7hHQ";

// ✅ Your spreadsheet ID
const SPREADSHEET_ID = "1D1d2SliUubYzLMANGU9fiRl4YevzkHuuqJRwPhiTeS0";

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [centerFilter, setCenterFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await Promise.all(
          SHEETS.map((sheet) =>
            fetch(
              `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheet.name}?key=${API_KEY}`
            )
              .then((res) => res.json())
              .then((json) => {
                if (!json.values) return [];
                const rows = json.values;
                // skip header row
                return rows.slice(1).map((r) => ({
                  callCenter: sheet.label,
                  firstName: r[0] || "",
                  lastName: r[1] || "",
                  startDate: r[2] || "",
                  supervisor: r[3] || "",
                  qaScore: r[4] || "",
                  finalReview: r[7] || "",
                }));
              })
          )
        );
        setData([].concat(...results));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = data.filter((row) => {
    const fullName = `${row.firstName} ${row.lastName}`.toLowerCase();
    const matchName = fullName.includes(search.toLowerCase());
    const matchCenter = centerFilter ? row.callCenter === centerFilter : true;
    return matchName && matchCenter;
  });

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <h1 className="mb-4 text-center">Agent QA Search</h1>

        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <AgentSearch value={search} onChange={setSearch} />
          </div>
          <div className="col-md-6 mb-2">
            <select
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
              className="form-select"
            >
              <option value="">All Call Centers</option>
              {SHEETS.map((s) => (
                <option key={s.name} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <AgentTable rows={filtered} />
        )}
      </div>
    </>
  );
}

export default App;
