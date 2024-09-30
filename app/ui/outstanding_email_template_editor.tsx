"use client";
import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { outstandingBlocks } from "./html_template_builder/outstanding_blocks";
import { useTheme } from "@mui/material";

const WebBuilder = ({
  initialTemplate = null,
  onExtract,
}: {
  initialTemplate?: string | null;
  onExtract: (htmlTemplate: string) => void;
}) => {
  const editorRef = useRef<any | null>(null);

  useEffect(() => {}, [initialTemplate]);
  const appTheme = useTheme();

  useEffect(() => {
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
              buildProps: ["width", "min-height", "padding"],
              properties: [
                {
                  type: "integer",
                  name: "The width",
                  property: "width",
                  units: ["px", "%"],
                  defaults: "auto",
                  min: 0,
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
            active: true,
            label: "<u>View</u>",
            command: "sw-visibility",
          },
          {
            id: "export",
            label: "Code",
            command: "export-template",
            context: "export-template",
          },
        ],
      });
      editorRef.current = editor;

      editor.on("component:update", () => {
        editor.refresh();
      });
    }
  }, []);

  const extractHtml = () => {
    if (editorRef.current) {
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();
      console.log("HTML Content:", html);
      console.log("CSS Content:", css);
      if (onExtract) {
        onExtract(html);
      }
      alert(`HTML: ${html}`);
    }
  };

  return (
    <div
      className="flex flex-row h-screen"
      style={{ backgroundColor: "green" }}
    >
      {/* Sidebar for the Blocks */}
      <div
        id="blocks"
        className="h-full"
        style={{
          width: "300px",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          padding: "10px",
          // backgroundColor: "red",
        }}
      ></div>

      {/* Editor Container */}
      <div
        className="flex flex-col flex-grow"
        style={{ backgroundColor: "green" }}
      >
        <div
          className="panel__top"
          // style={{ backgroundColor: "pink" }}
        >
          <div
            className="panel__basic-actions"
            // style={{ backgroundColor: "red" }}
          ></div>
        </div>
        <div
          id="gjs"
          className="h-full"
          style={{
            borderWidth: 3,
            position: "relative",
          }}
        >
          <h1>Hello World Component!</h1>
        </div>
        <div
          className="styles-container"
          // style={{ backgroundColor: "orange", color: "red" }}
        ></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <button
            onClick={extractHtml}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300"
            style={{
              backgroundColor: appTheme.palette.primary.main,
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                appTheme.palette.primary.dark)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                appTheme.palette.primary.main)
            }
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebBuilder;
