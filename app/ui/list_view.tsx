"use client";

import { useEffect, useRef, useState } from "react";
import { CircularProgress, Typography, Box, Paper } from "@mui/material";

interface ListViewProps {
  reloadTrigger: any;
  onApi: (pageNumber: number, pageSize: number) => Promise<any[]>;
  onRender: (entry: any, index: number) => React.ReactNode;
  usePagination?: boolean;
}

const ListView: React.FC<ListViewProps> = ({ reloadTrigger, onApi, onRender, usePagination = true }) => {
  const pageNumber = useRef<number>(1);
  const pageSize = useRef<number>(5);
  const lastIndex = useRef<number>(0);
  const resetEntries = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [entries, updateEntries] = useState<any[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchPageSize = async () => {
      const cachedPageSize = 10; // TODO: Replace with actual function to fetch page size
      pageSize.current = cachedPageSize;
      pageNumber.current = 1;
      resetEntries.current = true;
      lastIndex.current = 0;
      load();
    };

    fetchPageSize();
  }, [reloadTrigger]);

  useEffect(() => {
    if (!usePagination) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        pageNumber.current += 1;
        load();
      }
    });
    const currentObserver = observer.current;
    const loadMoreTrigger = document.querySelector("#load-more-trigger");
    if (loadMoreTrigger) {
      currentObserver.observe(loadMoreTrigger);
    }
    return () => currentObserver.disconnect();
  }, [usePagination]);

  const load = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await onApi(pageNumber.current, pageSize.current);
      const oldEntries = entries;
      const newEntries = response.map((entry) => {
        lastIndex.current++;
        return { ...entry, _index: lastIndex.current };
      });
      if (resetEntries.current) {
        updateEntries(newEntries);
        resetEntries.current = false;
      } else {
        updateEntries([...oldEntries, ...newEntries]);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'white', width: "100%" }}>
      {isLoading && entries.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {entries.length === 0 && !isLoading && (
        <Typography variant="h6" align="center" sx={{ fontFamily: "Poppins-Semi" }}>
          No Records Found
        </Typography>
      )}
      {entries.length > 0 && (
        <Box>
          {entries.map((entry, index) => (
            <Box key={entry._index}>{onRender(entry, index)}</Box>
          ))}
          {usePagination && (
            <Box
              id="load-more-trigger"
              sx={{ height: "1px" }}
            />
          )}
        </Box>
      )}
      {isLoading && entries.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};

export { ListView };