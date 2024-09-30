// "use client";

// import { useState } from "react";
// import { Box, TextField } from "@mui/material";
// import WebBuilder from "@/app/ui/outstanding_email_template_editor";
// import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
// import { useSnackbar } from "@/app/ui/snack_bar_provider";

// const EmailTemplate = () => {
//   const [templateName, setTemplateName] = useState<string>("");
//   const [htmlContent, setHtmlContent] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const snackbar = useSnackbar();

//   const handleExtract = (html: string) => {
//     setHtmlContent(html);
//   };

//   const createTemplate = async () => {
//     if (!templateName || !htmlContent) {
//       return snackbar.showSnackbar(
//         "Please provide a template name and content",
//         "error"
//       );
//     }

//     setLoading(true);

//     try {
//       let requestBody = {
//         CompanyID: "",
//         TemplateName: templateName,
//         HtmlContent: htmlContent,
//       };

//       let url = `${getSgBizBaseUrl()}/template/os/create`;
//       const response = await postAsync(url, requestBody);

//       if (response.status === 200 || response.status === 201) {
//         snackbar.showSnackbar("Template created successfully", "success");
//       } else {
//         throw new Error("Failed to create the template");
//       }
//     } catch (error: any) {
//       snackbar.showSnackbar("Failed to create template", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box className="container mx-auto p-4">
//       <Box mb={2}>
//         <TextField
//           label="Template Name"
//           fullWidth
//           variant="outlined"
//           value={templateName}
//           onChange={(e) => setTemplateName(e.target.value)}
//         />
//       </Box>

//       <WebBuilder
//         initialTemplate={templateName}
//         onExtract={handleExtract}
//       ></WebBuilder>
//     </Box>
//   );
// };

// export default EmailTemplate;

"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import WebBuilder from "@/app/ui/outstanding_email_template_editor";
import { getSgBizBaseUrl, getAsync, postAsync, putAsync } from "@/app/services/rest_services";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import { ApiDropDown } from "@/app/ui/api_drop_down";


interface Template {
  ID: string;
  CompanyId: string;
  TemplateName: string;
  HtmlContent: string;
}

const EmailTemplate = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateName, setTemplateName] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const snackbar = useSnackbar();

  // Fetch existing templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const url = `${getSgBizBaseUrl()}/template/os/get/all`;
        const response = await getAsync(url);

        if (response.status === 200) {
          console.log("Templates fetched: ", response.data.Data); // Check data here
          setTemplates(response.data.Data);
        } else {
          snackbar.showSnackbar("Failed to load templates", "error");
        }
      } catch (error: any) {
        snackbar.showSnackbar("Error fetching templates", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Handle selection of a template from the ApiDropDown
  const handleTemplateSelection = (selectedId: string) => {
    const selectedTemplate = templates.find((template) => template.ID === selectedId);
    console.log("Selected template: ", selectedTemplate); // Check selected template
    if (selectedTemplate) {
      setSelectedTemplate(selectedTemplate);
      setTemplateName(selectedTemplate.TemplateName);
      setHtmlContent(selectedTemplate.HtmlContent);
    }
  };

  // API call for dropdown to fetch template list
  const fetchTemplateData = async (searchValue: string): Promise<Template[]> => {
    // For search implementation, pass searchValue in the query string if needed
    const url = `${getSgBizBaseUrl()}/template/os/get/all`;
    const response = await getAsync(url);

    if (response.status === 200) {
      console.log("Dropdown API Response: ", response.data.Data); // Log the response to debug
      return response.data.Data;
    }
    snackbar.showSnackbar("Failed to load templates", "error");
    return [];
  };

  // Handle HTML extraction from WebBuilder
  const handleExtract = (html: string) => {
    setHtmlContent(html);
  };

  // Create or update template
  const createOrUpdateTemplate = async () => {
    if (!templateName || !htmlContent) {
      return snackbar.showSnackbar("Please provide a template name and content", "error");
    }

    setSaving(true);

    try {
      const requestBody = {
        TemplateName: templateName,
        HtmlContent: htmlContent,
      };

      let url;
      let response;

      // Check if editing an existing template
      if (selectedTemplate) {
        // Update existing template
        url = `${getSgBizBaseUrl()}/template/os/update`;
        response = await putAsync(url, requestBody);
      } else {
        // Create new template
        url = `${getSgBizBaseUrl()}/template/os/create`;
        response = await postAsync(url, requestBody);
      }

      if (response.status === 200 || response.status === 201) {
        snackbar.showSnackbar(
          selectedTemplate ? "Template updated successfully" : "Template created successfully",
          "success"
        );

        // Optionally refresh templates list after creation or update
        const updatedTemplates = await getAsync(`${getSgBizBaseUrl()}/template/os/get/all`);
        setTemplates(updatedTemplates.data.Data);
        setSelectedTemplate(null);
        setTemplateName("");
        setHtmlContent("");
      } else {
        throw new Error(selectedTemplate ? "Failed to update the template" : "Failed to create the template");
      }
    } catch (error: any) {
      snackbar.showSnackbar(
        selectedTemplate ? "Failed to update template" : "Failed to create template",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="container mx-auto p-4">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Dropdown for Selecting Template */}
          <ApiDropDown
            label="Select Template"
            displayFieldKey="TemplateName" // Ensure this matches the field name in your API
            valueFieldKey="ID" // Ensure this matches the unique ID field
            onApi={fetchTemplateData}
            helperText="Search and select an existing template"
            onSelection={handleTemplateSelection}
          />

          {/* Template Name Input */}
          <Box mb={2}>
            <TextField
              label="Template Name"
              fullWidth
              variant="outlined"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </Box>

          {/* WebBuilder for Editing or Creating Template Content */}
          <WebBuilder initialTemplate={htmlContent} onExtract={handleExtract} />

          {/* Save Button */}
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={createOrUpdateTemplate}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : selectedTemplate ? "Update Template" : "Create Template"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EmailTemplate;
