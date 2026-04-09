// search-result/page.tsx
"use client";

import React, { Suspense } from "react";
import SearchResultsContent from "./SearchResultsContent";

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}