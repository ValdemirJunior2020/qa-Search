import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";

// Helper to check pass/fail
function getPassStatus(text) {
  if (!text) return "neutral";
  const match = text.match(/(\d+)%/);
  if (!match) return "neutral";
  const score = parseInt(match[1], 10);
  const prefix = text.trim().toUpperCase();
  if (prefix.startsWith("CS")) {
    return score >= 90 ? "pass" : "fail";
  }
  if (prefix.startsWith("G")) {
    return score >= 85 ? "pass" : "fail";
  }
  return "neutral";
}

// Badge color for call center
function getBadgeClass(center) {
  switch (center) {
    case "Buwelo":
      return "bg-primary";
    case "WNS":
      return "bg-success";
    case "TEP":
      return "bg-warning text-dark";
    case "Concentrix":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

export default function AgentTable({ rows }) {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = useMemo(() => {
    let sortable = [...rows];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = (a[sortConfig.key] || "").toString().toLowerCase();
        const bVal = (b[sortConfig.key] || "").toString().toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [rows, sortConfig]);

  // Pagination slice
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = sortedRows.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  // Summary cards
  const summary = useMemo(() => {
    const counts = {
      Buwelo: { pass: 0, fail: 0 },
      WNS: { pass: 0, fail: 0 },
      TEP: { pass: 0, fail: 0 },
      Concentrix: { pass: 0, fail: 0 },
    };
    rows.forEach((r) => {
      const status = getPassStatus(r.qaScore);
      if (status === "pass") {
        counts[r.callCenter].pass++;
      } else if (status === "fail") {
        counts[r.callCenter].fail++;
      }
    });
    return counts;
  }, [rows]);

  // CSV headers
  const headers = [
    { label: "Call Center", key: "callCenter" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Start Date", key: "startDate" },
    { label: "Supervisor", key: "supervisor" },
    { label: "QA Scores", key: "qaScore" },
    { label: "Final Review", key: "finalReview" },
  ];

  return (
    <div>
      {/* 📊 Summary cards */}
      <div className="row mb-4">
        {Object.keys(summary).map((center) => (
          <div className="col-md-3 mb-3" key={center}>
            <div className="card text-center shadow">
              <div className={`card-header ${getBadgeClass(center)}`}>
                <strong>{center}</strong>
              </div>
              <div className="card-body">
                <p className="card-text mb-1">
                  ✅ Pass: <strong>{summary[center].pass}</strong>
                </p>
                <p className="card-text mb-0">
                  ❌ Fail: <strong>{summary[center].fail}</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top bar with total and CSV download */}
      <div className="d-flex justify-content-between mb-2">
        <h5>Results: {rows.length}</h5>
        <CSVLink
          data={sortedRows}
          headers={headers}
          filename="agent-scores.csv"
          className="btn btn-success"
        >
          Download CSV
        </CSVLink>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("callCenter")}>
                Call Center {sortConfig.key === "callCenter" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("firstName")}>
                First Name {sortConfig.key === "firstName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("lastName")}>
                Last Name {sortConfig.key === "lastName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("startDate")}>
                Start Date {sortConfig.key === "startDate" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("supervisor")}>
                Supervisor {sortConfig.key === "supervisor" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("qaScore")}>
                QA Scores {sortConfig.key === "qaScore" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("finalReview")}>
                Final Review {sortConfig.key === "finalReview" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No results found
                </td>
              </tr>
            ) : (
              currentRows.map((r, i) => {
                const status = getPassStatus(r.qaScore);
                const rowClass =
                  status === "pass" ? "table-success" : status === "fail" ? "table-danger" : "";
                return (
                  <tr key={i} className={rowClass}>
                    <td>
                      <span className={`badge ${getBadgeClass(r.callCenter)}`}>
                        {r.callCenter}
                      </span>
                    </td>
                    <td>{r.firstName}</td>
                    <td>{r.lastName}</td>
                    <td>{r.startDate}</td>
                    <td>{r.supervisor}</td>
                    <td>{r.qaScore}</td>
                    <td>{r.finalReview}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
