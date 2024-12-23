import React, { useEffect, useState } from "react";
import WebsiteControll from "../controllers/WebsiteController";
import { Link } from "react-router-dom";

const WebsiteListView = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    WebsiteControll.fetchPages(setPages);
  }, []);

  return (
    <div>
      <h2>Page List</h2>
      <Link to="/editor" className="btn btn-primary">Create New Page</Link>
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <Link to={`/editor/${page.id}`}>{page.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebsiteListView;