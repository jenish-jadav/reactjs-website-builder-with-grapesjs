import React, { useEffect, useRef, useState } from "react";
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css'; // GrapesJS styles
import pluginForms from 'grapesjs-plugin-forms'; // Import the plugin
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import pluginBasic  from 'grapesjs-blocks-basic';
import pluginNavbar  from 'grapesjs-navbar';
import customCodePlugin from 'grapesjs-custom-code';
import pluginTooltip from 'grapesjs-tooltip';
import styleFilter from 'grapesjs-style-filter';
import pluginStyleBg from 'grapesjs-style-bg';
import 'grapick/dist/grapick.min.css';
import parserPostCSS from 'grapesjs-parser-postcss';
import templatesPlugin  from 'grapesjs-templates';
import WebsiteController from "../controllers/WebsiteController";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const apiBaseUrl ='http://website.local/api';
  const pageId  = id;

  useEffect(() => {
    const loadEditorContent = async () => {
      
      const storageManagerConfig = {
        type: 'remote',
        stepsBeforeSave: 3,
        options: {
          remote: {
            urlLoad: `${apiBaseUrl}/grapesjs/load/${pageId}`,
            urlStore: `${apiBaseUrl}/grapesjs/save`,
            // The `remote` storage uses the POST method when stores data but
            // the json-server API requires PATCH.
            fetchOptions: (opts) => ({
              ...opts,
              method: opts.method === 'POST' ? 'PATCH' : opts.method,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',           
              },
          }),
          onStore: (data) => {
            // Get field values
            const title = document.querySelector('#title').value.trim();
            const description = document.querySelector('#description').value.trim();
            const html = editorRef.current.getHtml();
            const css = editorRef.current.getCss();
          

            // Validate fields
            if (!title || !description) {
              alert('Please fill in all required fields: Website Name and Description.');
              throw new Error('Validation failed: Missing required fields.');
            }
    
            // Include validated data in the payload
            return {
              id: pageId, // Assuming `pageId` is your identifier
              content: JSON.stringify(data), // Convert GrapesJS data to JSON
              title: title,     // Website Name
              description: description,      // Description
              html:html,
              css:css,
            };
          },
          // Process the data loaded from the backend
          onLoad: (result) => {
            try {
              document.querySelector('#title').value = result.title || '';
              document.querySelector('#description').value = result.description || '';
              // Parse the content field from the API response
              return JSON.parse(result.content || '{}'); 
            } catch (e) {
              console.error('Failed to parse editor content:', e.message);
              return {};
            }
          },
          }
        }
      }
      
      console.log("Storage Manager Config:", storageManagerConfig);
      
      const editor = grapesjs.init({
        container: '#gjs', // The element where GrapesJS will render
        width: '100%',
        height: '100vh', // Adjust this to fit inside the sidebar
        fromElement: true, // Optional if you start with predefined content
        storageManager:storageManagerConfig,
        plugins: [pluginBasic,pluginForms,pluginNavbar,customCodePlugin,pluginTooltip,styleFilter,pluginStyleBg,parserPostCSS,templatesPlugin ], // Add the Forms Plugin
        pluginsOpts: {
          [pluginBasic]: { /* options */ },
          [pluginForms]:  { /* options */ },          
          [pluginNavbar]: { /* options */ },
          [customCodePlugin]: { /* options */ },
          [pluginTooltip]: { /* options */ },
          [styleFilter]: { /* options */ },
          [pluginStyleBg]: { /* options */ },
          [parserPostCSS]: { /* options */ },               
          [templatesPlugin ]: { /* options */ },               
        },
       
      });

      editor.StyleManager.addProperty('extra', { extend: 'filter' });
      editor.StyleManager.addProperty('extra', { extend: 'filter', property: 'backdrop-filter' });
     
      editor.Panels.addButton("options", {
        id: "save-button",
        className: "fa fa-save",
        command: {
          run: (editor) => {
            editor.store()
              .then(() => {
                Swal.fire({
                            title: "Success!",
                            text: "The content has been saved successfully!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                console.log("Content saved successfully");
              })
              .catch((err) => {
                console.error("Error saving content:", err);
              });
          },
        },
        attributes: { title: "Save & Continue" },
      });

      editorRef.current = editor;

      // Debug storage events
      editor.on('storage:store', (data) => {
        console.log('Storing data:', data);
      });

      editor.on('storage:start:load', () => {
        console.log('Storage start load');
       });

      editor.on('storage:end', () => {
       
        console.log('Storage operation completed');
      });

      editor.on("storage:error", (error) => {
        console.error("Storage error detected:", error);
      });

      console.log("Store API URL:", editor.StorageManager.getConfig("options"));
    };

    loadEditorContent();

    return () => editorRef.current?.destroy();
  }, [apiBaseUrl, pageId]);

  const savePage = () => {
    const title = document.querySelector('#title').value.trim();
    const description = document.querySelector('#description').value.trim();
    const html = editorRef.current.getHtml();

    const editor = editorRef.current;

  // Use the store method to get all data
  const storedData = editor.store();

  console.log("All Editor Content:", storedData);

    // Validate fields
    if (!title || !description) {
        alert('Please fill in all required fields: Website Name and Description.');
        throw new Error('Validation failed: Missing required fields.');
    }
    const data = {id: pageId, content: JSON.stringify(storedData),title: title, description: description,html:html};
    
  };

  const handleInputChange = (e) => {
    // Optional: Handle field changes dynamically if needed
    console.log(`${e.target.name}: ${e.target.value}`);
  };

  const exportHtmlCss = () => {
    const editor = editorRef.current;

    // Get HTML and CSS from the editor
    const html = editor.getHtml();
    const css = editor.getCss();

    // Combine HTML and CSS into one file (optional)
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exported Page</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    // Trigger a download
    const blob = new Blob([fullHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exported-page.html";
    link.click();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: '300px', backgroundColor: '#f4f4f4', padding: '10px', overflowY: 'auto' }}>
       {/* Form for Additional Fields */}
      <div className="container py-3 border-bottom bg-light">
        <form className="row g-3">
          <div className="col-12">
            <label htmlFor="title" className="form-label fw-bold">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Enter Title"
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12">
            <label htmlFor="description" className="form-label fw-bold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Enter Description"
              rows="3"
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button type ='button' onClick={savePage} className="btn btn-success">Save Page</button>
        </form>
      </div>
      <button onClick={exportHtmlCss} className="btn btn-primary" style={{ margin: "10px" }}>
        Export HTML & CSS
      </button>
      </aside>
       
      <main className="flex-grow-1">
        <div id="gjs"></div> {/* GrapesJS Editor */}
      </main>
    </div>
  );
};

export default EditorView;
