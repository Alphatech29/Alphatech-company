import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "./partials/PageHeader";
import { getPageBySlug } from "../utilities/createPage";

export default function Page() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPage();
    }

  }, [slug]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPageBySlug(slug);

      if (response?.success && response?.data) {
        setPageData(response.data);
        document.title = `${response.data.title} | Alphatech Multimedia Technologies`;
      } else {
        setError("Page not found.");
        setPageData(null);
      }
    } catch (err) {
      console.error("Error fetching page by slug:", err);
      setError("Something went wrong while loading this page.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-primary-700">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-red-600">
        <h2 className="text-xl font-semibold mb-2">Oops!</h2>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={pageData?.title}
        description={pageData?.description}
      />

      <main className="max-w-4xl mx-auto px-6 py-12 bg-white shadow-sm rounded-2xl mt-6">
        {pageData?.content ? (
          <div
            className="prose prose-primary max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        ) : (
          <p className="text-gray-500 italic">
            No content available for this page.
          </p>
        )}
      </main>
    </div>
  );
}
