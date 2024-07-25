"use client";
import React from 'react';

interface EmailOptions {
  title: string;
  cancelButtonTitle: string;
  message: string;
  emails: string[];
}

interface NumberOptions {
  title: string;
  cancelButtonTitle: string;
  message: string;
  numbers: string[];
}

export const handleEmail = (emails: string[] | undefined) => {
  if (!emails || emails.length === 0) return;

  const options: EmailOptions = {
    title: "Select an Email",
    cancelButtonTitle: "Cancel",
    message: "Please Select an Email",
    emails,
  };
  showEmailOptions(options);
};

const showEmailOptions = (options: EmailOptions) => {
  if (typeof window !== 'undefined') {
    const email = window.prompt(options.message, options.emails[0]);
    if (email && options.emails.includes(email)) {
      window.open(`mailto:${email}`, '_blank');
    }
  }
};

export const handleCall = (numbers: string[] | undefined) => {
  if (!numbers || numbers.length === 0) return;

  const options: NumberOptions = {
    title: "Select a number",
    cancelButtonTitle: "Cancel",
    message: "Please select a number to call",
    numbers,
  };

  showNumberOptions(options);
};

const showNumberOptions = (options: NumberOptions) => {
  if (typeof window !== 'undefined') {
    const number = window.prompt(options.message, options.numbers[0]);
    if (number && options.numbers.includes(number)) {
      window.open(`tel:${number}`, '_blank');
    }
  }
};

export const handleMapPress = (type: 'address' | 'pincode', content: string) => {
  if (!content || content === "-" || content === "0") {
    return;
  }

  let cleanedContent = content;
  if (type === "address") {
    cleanedContent = content
      .replace(/\.{2,}/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const query = type === "address" ? cleanedContent : `pincode ${content}`;
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(query)}`;
  
  if (typeof window !== 'undefined') {
    window.open(mapUrl, '_blank');
  }
};