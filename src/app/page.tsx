"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const hasToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (!hasToken) {
      router.push("/login");
    }
  }, []);
}