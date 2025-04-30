import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questionsAnswers = [
    {
      question: "What is RealTimeBooking?",
      answer:
        "RealTimeBooking is a platform that allows users to rent top-quality gadgets at affordable prices or earn passive income by renting out their own gadgets.",
    },
    {
      question: "How do I rent a gadget?",
      answer:
        "Simply browse through the available listings, select the gadget you want, choose the rental duration, and confirm your booking.",
    },
    {
      question: "Can I list my own gadgets for rent?",
      answer:
        "Yes! You can list your gadgets on RealTimeBooking and start earning passive income. Just sign up, add your gadget details, and set your rental price.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Absolutely! We use secure payment gateways and verified transactions to ensure a safe and hassle-free experience.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our support team via email at support@realtimebooking.com or through the contact form on our website.",
    },
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="pb-16 ">
      <div className="container max-w-7xl mx-auto px-2">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {questionsAnswers.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-300"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.question}
                </h3>
                <span className="text-gray-600">
                  {activeIndex === index ? <ChevronDown /> : <ChevronRight />}
                </span>
              </div>
              {activeIndex === index && (
                <p className="mt-4 text-gray-600">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
