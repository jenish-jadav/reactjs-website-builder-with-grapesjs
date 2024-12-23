import apiService from "../services/apiService";

const WebsiteModel = {
  getAllPages: () => apiService.get("/grapesjs"),
  getPageById: (id) => apiService.get(`/grapesjs/load/${id}`),
  createPage: (data) => apiService.post("/grapesjs/save", data),
  updatePage: (id, data) => apiService.patch(`/grapesjs/save`, data),
  deletePage: (id) => apiService.delete(`/grapesjs/${id}`),
};

export default WebsiteModel;