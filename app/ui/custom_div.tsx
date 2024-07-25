"use client";

import { ReactNode } from "react";

interface ResponsiveDivProps {
  children: ReactNode;
  className?: string;
}

const ResponsiveDiv: React.FC<ResponsiveDivProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`w-full max-w-full flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center ${className} `}
    >
      {children}
    </div>
  );
};
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

const Item = styled(Card)({
  padding: '16px',
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#3f51b5',
  height: '100%',
});

const items = Array.from({ length: 12 }, (_, index) => index + 1);

const ResponsiveGrid: React.FC = () => {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item}>
          <Item>
            <CardContent>
              <Typography variant="h5">Item {item}</Typography>
            </CardContent>
          </Item>
        </Grid>
      ))}
    </Grid>
  );
};

export { ResponsiveDiv,  ResponsiveGrid };