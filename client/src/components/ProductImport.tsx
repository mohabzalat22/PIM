import { useState, useRef } from "react";
import { Upload, Loader2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ProductImportService } from "../services/productImport.service";
import type { ImportResult } from "../api/productImport";

export function ProductImport({ onImportComplete }: { onImportComplete?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = ProductImportService.validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await ProductImportService.import(selectedFile);
      setImportResult(result);

      if (result.data.summary.successful > 0) {
        toast.success(
          `Import completed: ${result.data.summary.created} created, ${result.data.summary.updated} updated`
        );
        if (onImportComplete) {
          onImportComplete();
        }
      }

      if (result.data.summary.failed > 0 || result.data.summary.skipped > 0) {
        toast.warning(
          `${result.data.summary.failed} failed, ${result.data.summary.skipped} skipped`
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to import products"
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Products</DialogTitle>
          <DialogDescription>
            Upload a file to import products (JSON, XML, or CSV)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.xml,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <FileText className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Click to select file or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported: JSON, XML, CSV (Max 50MB)
                </p>
              </div>
            </label>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleImport}
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import"
                )}
              </Button>
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="space-y-3 border rounded-lg p-4">
              <h3 className="font-semibold text-sm">Import Summary</h3>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Total: {importResult.data.summary.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Successful: {importResult.data.summary.successful}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>Created: {importResult.data.summary.created}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                  <span>Updated: {importResult.data.summary.updated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span>Failed: {importResult.data.summary.failed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span>Skipped: {importResult.data.summary.skipped}</span>
                </div>
              </div>

              {/* Errors */}
              {(importResult.data.summary.errors.length > 0 ||
                importResult.data.validationErrors.length > 0) && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-sm text-red-600">Errors:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {importResult.data.summary.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-red-50 p-2 rounded border border-red-200"
                      >
                        <span className="font-medium">SKU {error.sku}:</span>{" "}
                        {error.error}
                      </div>
                    ))}
                    {importResult.data.validationErrors.map((error, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-orange-50 p-2 rounded border border-orange-200"
                      >
                        <span className="font-medium">SKU {error.sku}:</span>{" "}
                        {error.errors.map((e) => e.message).join(", ")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
