import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebsiteListView from "../views/WebsiteListView";
import EditorView from "../views/EditorView";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<WebsiteListView />} />
      <Route path="/editor" element={<EditorView />} />
      <Route path="/editor/:id" element={<EditorView />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
