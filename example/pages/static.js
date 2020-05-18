import React from "react";
import Link from "next/link";

export default function StaticOptimizedPage() {
  return (
    <div>
      <h1>Static Page</h1>
      <br />
      <Link href="/">
        <a href="/">to server page</a>
      </Link>
    </div>
  );
}
