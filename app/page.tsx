"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "../src/components/Navbar";
import Highlights from "../src/components/Highlights";
import Features from "../src/components/Features";
import Hero from "../src/components/Hero";
import Footer from "../src/components/Footer";
import HowItWorks from "../src/components/HowItWorks";
import "../src/index.css";

// src/index.css
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken") ?? null;
    if (token !== null && token.length > 0) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  }, [router]);

  return (
    <main className="bg-white">
      {/* <Navbar />
      <Hero />
      <Highlights />
      <Features />
      <HowItWorks />
      <Footer /> */}
    </main>
  );
}
