import WebsiteModel from "../models/WebsiteModel";

const WebsiteController = {
  async fetchPages(setPages) {
    try {
      const response = await WebsiteModel.getAllPages();
      setPages(response.data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  },

  async fetchPageContent(id, setContent) {
    try {
      const response = await WebsiteModel.getPageById(id);
      setContent(response.data.content);
    } catch (error) {
      console.error("Error fetching page content:", error);
    }
  },

  async savePage(data, callback) {
    try {
      await WebsiteModel.createPage(data);
      callback();
    } catch (error) {
      console.error("Error saving page:", error);
    }
  },

  async updatePage(id, data, callback) {
    try {
        console.log('update page',data);
        console.log('update page is',id);
      await WebsiteModel.updatePage(id, data);
      callback();
    } catch (error) {
      console.error("Error updating page:", error);
    }
  },

  async deletePage(id, callback) {
    try {
      await WebsiteModel.deletePage(id);
      callback();
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  },
};

export default WebsiteController;