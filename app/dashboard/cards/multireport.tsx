"use client";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const MultiReport = ({}) => {
  const router = useRouter();
  const [data, setData] = useState<[]>([]);

  return <Box className="p-0"></Box>;
};

export { MultiReport };
