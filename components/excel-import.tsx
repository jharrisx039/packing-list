"use client";

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface ExcelImportProps {
  onImport: (items: any[]) => void;
}

const TEMPLATE_HEADERS = [
  "PackageType",
  "Condition",
  "Description",
  "Length",
  "Width",
  "Height",
  "Weight",
  "Quantity",
  "Price",
  "Remarks"
];

const SAMPLE_DATA = [
  {
    PackageType: "Box",
    Condition: "New",
    Description: "Sample Item",
    Length: "12",
    Width: "8",
    Height: "4",
    Weight: "2",
    Quantity: "1",
    Price: "25.00",
    Remarks: "Sample remarks"
  }
];

export function ExcelImport({ onImport }: ExcelImportProps) {
  const downloadTemplate = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(SAMPLE_DATA, { header: TEMPLATE_HEADERS });
      
      // Add column widths
      const colWidths = [
        { wch: 15 }, // PackageType
        { wch: 10 }, // Condition
        { wch: 30 }, // Description
        { wch: 10 }, // Length
        { wch: 10 }, // Width
        { wch: 10 }, // Height
        { wch: 10 }, // Weight
        { wch: 10 }, // Quantity
        { wch: 10 }, // Price
        { wch: 40 }, // Remarks
      ];
      worksheet['!cols'] = colWidths;

      // Create workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

      // Save the file
      XLSX.writeFile(workbook, "packing-list-template.xlsx");
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Error creating template file');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Transform the data to match our item schema
        const items = jsonData.map((row: any, index) => ({
          itemNumber: (index + 1).toString().padStart(3, '0'),
          packagingType: row.PackageType || 'Box',
          condition: (row.Condition || 'new').toLowerCase(),
          description: row.Description || '',
          length: row.Length?.toString() || '',
          width: row.Width?.toString() || '',
          height: row.Height?.toString() || '',
          weight: row.Weight?.toString() || '',
          quantity: row.Quantity?.toString() || '1',
          price: row.Price?.toString() || '',
          remarks: row.Remarks || '',
        }));

        if (items.length === 0) {
          toast.error('No items found in the Excel file');
          return;
        }

        onImport(items);
        toast.success(`Successfully imported ${items.length} items`);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast.error('Error parsing Excel file. Please check the format.');
      }
    };

    reader.readAsArrayBuffer(file);
  }, [onImport]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={(e) => {
          e.preventDefault();
          downloadTemplate();
        }}
      >
        <Download className="h-4 w-4 mr-2" />
        Download Template
      </Button>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <Button variant="ghost" className="w-full h-full">
          <Upload className="h-4 w-4 mr-2" />
          {isDragActive ? 'Drop the Excel file here' : 'Import from Excel'}
        </Button>
      </div>
    </div>
  );
}