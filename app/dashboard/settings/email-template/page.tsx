"use client";

import { useState, useEffect } from "react";
import { Box, TextField, CircularProgress } from "@mui/material";
import WebBuilder from "@/app/ui/outstanding_email_template_editor";
import {
  getSgBizBaseUrl,
  getAsync,
  postAsync,
  putAsync,
} from "@/app/services/rest_services";
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
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
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

        // Work with response.Data directly
        if (response?.Data) {
          console.log("Templates fetched: ", response.Data);
          setTemplates(response.Data); // Use response.Data directly
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

  // Handle selection of a template by TemplateName
  const handleTemplateSelection = (selectedTemplateName: string) => {
    // console.log("Selected Template Name from Dropdown: ", selectedTemplateName);

    // Correctly map the template by TemplateName
    const selectedTemplate = templates.find(
      (template) => template.TemplateName === selectedTemplateName
    );

    if (selectedTemplate) {
      console.log("Selected template: ", selectedTemplate);
      setSelectedTemplate(selectedTemplate);
      setTemplateName(selectedTemplate.TemplateName);
      setHtmlContent(selectedTemplate.HtmlContent);
    } else {
      console.log(
        "No matching template found for Template Name: ",
        selectedTemplateName
      );
    }
  };

  const fetchTemplateData = async () => {
    try {
      const url = `${getSgBizBaseUrl()}/template/os/get/all`;
      const response = await getAsync(url);

      if (response?.Data) {
        const values = response.Data.map((entry: any) => ({
          name: entry.TemplateName,
          ...entry,
        }));

        return values;
      }
      return [];
    } catch (error) {
      console.error("Error fetching template data: ", error);
      return [];
    }
  };

  // Handle HTML extraction from WebBuilder
  const handleExtract = (html: string) => {
    setHtmlContent(html); // Extract new HTML content from WebBuilder
  };

  // Create or update template
  const createOrUpdateTemplate = async (html: string) => {
    if (!templateName || !html) {
      return snackbar.showSnackbar(
        "Please provide a template name and content",
        "error"
      );
    }

    setSaving(true);

    try {
      const wrappedHtmlContent = `<html>${html}</html>`;

      const requestBody = {
        TemplateName: templateName,
        HtmlContent: wrappedHtmlContent,
      };

      let url;
      let response;

      if (selectedTemplate) {
        url = `${getSgBizBaseUrl()}/template/os/update`;
        response = await putAsync(url, requestBody);
      } else {
        url = `${getSgBizBaseUrl()}/template/os/create`;
        response = await postAsync(url, requestBody);
      }

      if (response === null || response === "") {
        snackbar.showSnackbar(
          selectedTemplate
            ? "Template updated successfully"
            : "Template created successfully",
          "success"
        );

        const updatedTemplates = await getAsync(
          `${getSgBizBaseUrl()}/template/os/get/all`
        );
        setTemplates(updatedTemplates.Data); // Correct path to templates (use response.Data)
        setSelectedTemplate(null);
        setTemplateName("");
        setHtmlContent(""); // Reset after creation/update
      } else {
        throw new Error(
          selectedTemplate
            ? "Failed to update the template"
            : "Failed to create the template"
        );
      }
    } catch (error: any) {
      snackbar.showSnackbar(
        selectedTemplate
          ? "Failed to update template"
          : "Failed to create template",
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
          <Box mb={2}>
            <ApiDropDown
              label="Select Template"
              displayFieldKey="name"
              valueFieldKey="name"
              onApi={fetchTemplateData}
              helperText=""
              onSelection={handleTemplateSelection}
            />
          </Box>
          <Box mb={4}>
            <TextField
              label="Template Name"
              fullWidth
              variant="outlined"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </Box>

          <WebBuilder
            key={htmlContent}
            initialTemplate={htmlContent}
            onExtract={createOrUpdateTemplate}
          />
        </>
      )}
    </Box>
  );
};

export default EmailTemplate;
