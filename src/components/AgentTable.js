import React, { useState } from "react";
import { CSVLink } from "react-csv";

function isLowScore(text) {
  if (!text) return false;
  const match = text.match(/(\d+)%/);
  if (!match) return false;
  const score = parseInt(match[1], 10);
  if (text.trim().startsWith("CS>")) return score < 90;
  if (text.trim().startsWith("G>")) return score < 85;
  return false;
}

export default function AgentTable({ rows }) {
  const headers = [
    { label: "Call Center", key: "callCenter" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Start Date", key: "startDate" },
    { label: "Supervisor", key: "supervisor" },
    { label: "QA Scores", key: "qaScore" },
    { label: "Final Review", key: "finalReview" },
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = React.useMemo(() => {
    let sortable = [...rows];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key]?.toString().toLowerCase() || "";
        const bVal = b[sortConfig.key]?.toString().toLowerCase() || "";
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [rows, sortConfig]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = sortedRows.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  // Color badge for call center
  const getBadgeClass = (center) => {
    switch (center) {
      case 'Buwelo': return 'bg-primary';
      case 'WNS': return 'bg-success';
      case 'TEP': return 'bg-warning text-dark';
      case 'Concentrix': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div>
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

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort('callCenter')} style={{cursor:'pointer'}}>Call Center</th>
              <th onClick={() => handleSort('firstName')} style={{cursor:'pointer'}}>First Name</th>
              <th onClick={() => handleSort('lastName')} style={{cursor:'pointer'}}>Last Name</th>
              <th onClick={() => handleSort('startDate')} style={{cursor:'pointer'}}>Start Date</th>
              <th onClick={() => handleSort('supervisor')} style={{cursor:'pointer'}}>Supervisor</th>
              <th onClick={() => handleSort('qaScore')} style={{cursor:'pointer'}}>QA Scores</th>
              <th onClick={() => handleSort('finalReview')} style={{cursor:'pointer'}}>Final Review</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No results found</td>
              </tr>
            ) : (
              currentRows.map((r, i) => (
                <tr key={i} className={isLowScore(r.qaScore) ? "table-danger" : ""}>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
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
