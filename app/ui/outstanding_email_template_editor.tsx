"use client";
import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { outstandingBlocks } from "./html_template_builder/outstanding_blocks";

const WebBuilder = ({
  initialTemplate = null,
  onExtract,
}: {
  initialTemplate?: string | null;
  onExtract: (htmlTemplate: string) => void;
}) => {
  // Type the useRef to either be 'null' or a GrapesJS Editor instance
  const editorRef = useRef<any | null>(null);

  useEffect(() => {
    //editorRef.current.setCurrent
  }, [initialTemplate]);

  useEffect(() => {
    // Initialize the GrapesJS editor only if it hasn't been initialized
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#gjs",
        fromElement: true,
        height: "600px",
        width: "auto",
        storageManager: false,
        panels: { defaults: [] },
        blockManager: {
          appendTo: "#blocks",
          blocks: outstandingBlocks,
        },
        styleManager: {
          appendTo: ".styles-container",
          sectors: [
            {
              name: "Dimension",
              open: false,
              // Use built-in properties
              buildProps: ["width", "min-height", "padding"],
              // Use `properties` to define/override single property
              properties: [
                {
                  // Type of the input,
                  // options: integer | radio | select | color | slider | file | composite | stack
                  type: "integer",
                  name: "The width", // Label for the property
                  property: "width", // CSS property (if buildProps contains it will be extended)
                  units: ["px", "%"], // Units, available only for 'integer' types
                  defaults: "auto", // Default value
                  min: 0, // Min value, available only for 'integer' types
                },
              ],
            },
            {
              name: "Extra",
              open: false,
              buildProps: ["background-color", "box-shadow", "custom-prop"],
              properties: [
                {
                  id: "custom-prop",
                  name: "Custom Label",
                  property: "font-size",
                  type: "select",
                  defaults: "32px",
                  // List of options, available only for 'select' and 'radio'  types
                  options: [
                    { id: "1", value: "12px", name: "Tiny" },
                    { id: "2", value: "18px", name: "Medium" },
                    { id: "3", value: "32px", name: "Big" },
                  ],
                },
              ],
            },
          ],
        },
      });

      if (initialTemplate) {
        editor.setComponents(initialTemplate);
      }

      editor.Panels.addPanel({
        id: "panel-top",
        el: ".panel__top",
      });
      editor.Panels.addPanel({
        id: "basic-actions",
        el: ".panel__basic-actions",
        buttons: [
          {
            id: "visibility",
            active: true, // active by default
            label: "<u>View</u>",
            command: "sw-visibility", // Built-in command
          },
          {
            id: "export",
            label: "Code",
            command: "export-template",
            context: "export-template", // For grouping context of buttons from the same panel
          },
        ],
      });
      // Store the editor instance in the ref to persist it across renders
      editorRef.current = editor;

      // Listen to component updates and trigger refresh
      editor.on("component:update", () => {
        editor.refresh();
      });
    }
  }, []); // Empty dependency array ensures this runs only once after mount

  const extractHtml = () => {
    if (editorRef.current) {
      const html = editorRef.current.getHtml(); // Get HTML as a string
      const css = editorRef.current.getCss(); // Optionally get CSS
      console.log("HTML Content:", html);
      console.log("CSS Content:", css);
      if (onExtract) {
        onExtract(html);
      }
      alert(`HTML: ${html}`);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="panel__top">
        <div className="panel__basic-actions"></div>
        <div className="panel__switcher"></div>
      </div>
      <div
        id="gjs"
        className="h-full"
        style={{
          borderWidth: 3,
        }}
      >
        <h1>Hello World Component!</h1>
      </div>
      <div
        id="blocks"
        className="w-full h-auto"
        style={{
          border: "1px solid #ccc",
          overflow: "auto",
        }}
      ></div>
      <div className="styles-container"></div>

      <button
        onClick={extractHtml}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Extract HTML
      </button>
    </div>
  );
};

export default WebBuilder;
