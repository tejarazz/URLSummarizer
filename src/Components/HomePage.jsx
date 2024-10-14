import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { IoMdLink } from "react-icons/io";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-markdown";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const HomePage = () => {
  const [inputType, setInputType] = useState("url");
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    setInput("");
    setSummary("");

    try {
      const prompt =
        inputType === "url"
          ? `Please provide an accurate and comprehensive summary of the main points, key arguments, and significant details from the article at the following URL: ${input}.`
          : `Please provide an accurate and comprehensive summary of the following text: "${input}".`;

      const result = await model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setSummary((prev) => prev + chunkText);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Failed to generate summary.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-100 via-pink-100 to-green-100 min-h-screen backdrop-blur-3xl">
      <header className="h-20 flex justify-between items-center p-5 md:p-10">
        <div className="flex items-center gap-2">
          <img
            src="logo.webp"
            alt="Logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          <h1 className="text-2xl md:text-4xl font-bold">TextBite</h1>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-700 md:px-6">
          GitHub
        </button>
      </header>

      <section className="flex flex-col items-center pt-10 px-4">
        <p className="font-extrabold text-3xl md:text-6xl pb-2">
          Summarize Articles with
        </p>
        <p className="font-bold text-4xl md:text-6xl pb-5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text">
          TextBite
        </p>
        <p className="max-w-xl text-center text-base md:text-lg">
          Simplify your reading with TextBite, an open-source article summarizer
          that transforms lengthy articles into clear and concise summaries.
        </p>

        <div className="flex gap-4 mt-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="inputType"
              value="url"
              checked={inputType === "url"}
              onChange={() => setInputType("url")}
            />
            URL
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="inputType"
              value="text"
              checked={inputType === "text"}
              onChange={() => setInputType("text")}
            />
            Text
          </label>
        </div>

        <form
          className="flex flex-col md:flex-row gap-2 bg-white px-4 py-2 mt-6 rounded-xl w-full max-w-lg items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center w-full gap-2">
            {inputType === "url" && <IoMdLink size={20} />}
            {inputType === "url" ? (
              <input
                type="url"
                placeholder="Enter a URL"
                className="w-full outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Enter a URL to summarize"
              />
            ) : (
              <textarea
                placeholder="Enter text to summarize"
                className="w-full outline-none resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Enter text to summarize"
                rows={4}
              />
            )}
          </div>
          <button type="submit" className="cursor-pointer">
            <FaArrowUp size={16} />
          </button>
        </form>

        {summary && (
          <div className="my-5 bg-white rounded-lg py-10 shadow-lg w-3/5 text-justify flex flex-col items-center">
            <h3 className="font-bold text-3xl text-gray-800 mb-8">Summary:</h3>
            <Markdown className="w-full px-20 prose-headings:text-xl prose-headings:font-bold prose-p:pt-3 prose-li:py-1">
              {summary}
            </Markdown>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
