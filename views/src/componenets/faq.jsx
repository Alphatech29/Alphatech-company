import { useState, useEffect } from "react";
import { getFaqsData } from "../utilities/faqs";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const response = await getFaqsData();
        if (response.success) {
          const sortedFaqs = response.data.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
          setFaqs(sortedFaqs);
        } else {
          console.error("Failed to fetch FAQs:", response.message);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
      setLoading(false);
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-4 lg:px-40">
      <div>
        <h2 className="text-3xl font-bold text-center text-primary-200 mb-12">
          Frequently Asked Questions
        </h2>

        {loading ? (
          <p className="text-center text-primary-600">Loading FAQs...</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="bg-primary-100 rounded-xl shadow-sm shadow-primary-500 hover:border-l-4 hover:border-secondary-500 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                >
                  <span className="text-lg font-medium text-primary-800">
                    {faq.question}
                  </span>
                  <span className="transform transition-transform duration-300">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 text-primary-600 text-sm border-t border-primary-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
