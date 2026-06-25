import React, { useState, useRef } from "react";
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react";

interface BulkOrderUploadProps {
  onUpload: (items: { sku: string; quantity: number }[]) => void;
  onClose: () => void;
}

export function BulkOrderUpload({ onUpload, onClose }: BulkOrderUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<{ sku: string; quantity: number }[]>([]);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      parseFile(selectedFile);
    }
  };

  const parseFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const lines = text.split("\n").filter(line => line.trim());
        const items: { sku: string; quantity: number }[] = [];

        // Skip header row if it exists
        const startIndex = lines[0].toLowerCase().includes("sku") ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
          const columns = lines[i].split(",").map(col => col.trim());
          if (columns.length >= 2) {
            const sku = columns[0];
            const quantity = parseInt(columns[1], 10);

            if (sku && !isNaN(quantity) && quantity > 0) {
              items.push({ sku, quantity });
            }
          }
        }

        if (items.length === 0) {
          setError("No valid items found in file. Ensure CSV has SKU and Quantity columns.");
          setParsedItems([]);
        } else {
          setParsedItems(items);
        }
      } catch (err) {
        setError("Failed to parse file. Please ensure it's a valid CSV format.");
        setParsedItems([]);
      }
      setIsProcessing(false);
    };

    reader.onerror = () => {
      setError("Failed to read file.");
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (parsedItems.length > 0) {
      onUpload(parsedItems);
      onClose();
    }
  };

  const downloadTemplate = () => {
    const template = "SKU,Quantity\nPROD-001,50\nPROD-002,100\nPROD-003,25";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk_order_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-500" />
              Bulk Order Upload
            </h3>
            <p className="text-xs text-gray-500 mt-1">Upload CSV or Excel file with SKU and Quantity columns</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Template Download */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-blue-900">Need a template?</p>
                <p className="text-[10px] text-blue-700 mt-0.5">Download our CSV template to get started</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-lg transition flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" /> Download Template
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              file ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-400 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                file ? "bg-orange-100" : "bg-gray-100"
              }`}>
                {file ? (
                  <FileText className="w-8 h-8 text-orange-500" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              {file ? (
                <div>
                  <p className="text-sm font-bold text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-bold text-gray-900">Drop your file here or click to browse</p>
                  <p className="text-xs text-gray-500">Supports CSV, Excel files</p>
                </>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black px-6 py-2 rounded-lg transition"
              >
                {file ? "Change File" : "Select File"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Parsed Items Preview */}
          {parsedItems.length > 0 && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-200 bg-gray-100">
                <p className="text-xs font-black text-gray-900 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  {parsedItems.length} items parsed successfully
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="py-2 px-3 text-left font-black text-gray-600 text-[10px] uppercase">SKU</th>
                      <th className="py-2 px-3 text-right font-black text-gray-600 text-[10px] uppercase">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {parsedItems.slice(0, 10).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="py-2 px-3 font-medium text-gray-900">{item.sku}</td>
                        <td className="py-2 px-3 text-right font-bold text-gray-700">{item.quantity}</td>
                      </tr>
                    ))}
                    {parsedItems.length > 10 && (
                      <tr>
                        <td colSpan={2} className="py-2 px-3 text-center text-gray-500 text-[10px]">
                          +{parsedItems.length - 10} more items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={parsedItems.length === 0 || isProcessing}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-black px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                Upload {parsedItems.length} Items
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
