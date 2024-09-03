"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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

  return <main className="bg-white"></main>;
}
