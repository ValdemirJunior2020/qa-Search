import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Agent QA Dashboard</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              {/* use span with role=button to avoid anchor-is-valid */}
              <span className="nav-link" role="button" tabIndex={0}>About</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" role="button" tabIndex={0}>Contact</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
