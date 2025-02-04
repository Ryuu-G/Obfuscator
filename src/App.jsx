import React, { useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Copy, Menu } from "lucide-react";
import { motion } from "framer-motion";
import obfuscator from "javascript-obfuscator";
import Footer from "./components/ui/footer";

const languages = ["JavaScript", "TypeScript", "HTML"];

export default function Obfuscator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleObfuscate = async () => {
    try {
      let codeToObfuscate = input;

      if (selectedLanguage === "TypeScript") {
        const ts = await import("typescript");
        const result = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
        codeToObfuscate = result.outputText;

        const obfuscated = obfuscator
          .obfuscate(codeToObfuscate, { compact: true })
          .getObfuscatedCode();
        setOutput(obfuscated);
      } else if (selectedLanguage === "JavaScript") {
        const obfuscated = obfuscator
          .obfuscate(codeToObfuscate, { compact: true })
          .getObfuscatedCode();
        setOutput(obfuscated);
      } else if (selectedLanguage === "HTML") {
        const htmlObfuscator = await import("html-obfuscator");
        const obfuscated = htmlObfuscator.obfuscate(codeToObfuscate);
        setOutput(obfuscated);
      }
    } catch (error) {
      console.error("Obfuscation failed:", error.message);
      setOutput(`Error during obfuscation: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 flex-col">
      <div className="flex-1 flex">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: sidebarOpen ? 256 : 0 }} 
          transition={{ duration: 0.3 }}
          className="bg-gray-900 text-white p-6 flex flex-col shadow-lg rounded-r-lg overflow-hidden"
        >
          {sidebarOpen && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Select Language</h2>
              {languages.map((lang) => (
                <button key={lang} onClick={() => setSelectedLanguage(lang)}
                  className={`p-3 mt-2 rounded-lg transition-colors duration-300 ${selectedLanguage === lang ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"}`}>
                  {lang}
                </button>
              ))}
            </>
          )}
        </motion.div>
        <div className="flex-1 flex flex-col p-6">
          <button className="mb-4 p-2 rounded bg-gray-300 hover:bg-gray-400 transition" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your code here" className="h-96 p-4 border rounded-lg shadow-sm bg-white" />
            <div className="relative">
              <Textarea value={output} readOnly className="h-96 p-4 border rounded-lg shadow-sm bg-gray-200" />
              <Button onClick={() => navigator.clipboard.writeText(output)} className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md">
                <Copy size={16} />
              </Button>
            </div>
          </div>
          <Button onClick={handleObfuscate} className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition">Obfuscate</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
