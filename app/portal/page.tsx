"use client";
import WebBuilder from "../ui/outstanding_email_template_editor";

const Page = () => {
  return (
    <div className="w-full h-[100vh] p-1">
      <WebBuilder onExtract={(htmlTemplate: string) => {}} />
    </div>
  );
};

export default Page;
