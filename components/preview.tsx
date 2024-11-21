"use client";

import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatPrice, type Currency } from "@/lib/utils";
import html2pdf from "html2pdf.js";

interface PreviewProps {
  form: UseFormReturn<any>;
  measurementUnit: "metric" | "imperial";
  currency: Currency;
}

export function Preview({ form, measurementUnit, currency }: PreviewProps) {
  const values = form.watch();
  const total = values.items?.reduce((acc: number, item: any) => {
    return acc + (parseFloat(item.price || "0") * parseFloat(item.quantity || "0"));
  }, 0) || 0;

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-content');
    const opt = {
      margin: 1,
      filename: 'packing-list.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <Card className="bg-white">
      <CardHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadPDF}
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          <div id="invoice-content" className="space-y-6">
            <div className="text-right">
              <h2 className="text-xl font-bold">INVOICE</h2>
              <p className="text-sm text-muted-foreground">Invoice #: INV-001</p>
              <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Ship From:</h3>
                <div className="text-sm">
                  {values.shipper?.type === "company" ? (
                    <>
                      <p className="font-medium">{values.shipper.companyName}</p>
                      {values.shipper.taxId && <p>{values.shipper.taxId}</p>}
                      <p>Contact: {values.shipper.firstName} {values.shipper.lastName}</p>
                    </>
                  ) : (
                    <>
                      <p>{values.shipper?.firstName} {values.shipper?.lastName}</p>
                      {values.shipper?.personalId && <p>{values.shipper.personalId}</p>}
                    </>
                  )}
                  <p>{values.shipper?.address}</p>
                  <p>{values.shipper?.city}, {values.shipper?.stateProvince} {values.shipper?.zipCode}</p>
                  <p>{values.shipper?.country}</p>
                  <p>{values.shipper?.phone}</p>
                  <p>{values.shipper?.email}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <div className="text-sm">
                  {values.consignee?.type === "company" ? (
                    <>
                      <p className="font-medium">{values.consignee.companyName}</p>
                      {values.consignee.taxId && <p>{values.consignee.taxId}</p>}
                      <p>Contact: {values.consignee.firstName} {values.consignee.lastName}</p>
                    </>
                  ) : (
                    <>
                      <p>{values.consignee?.firstName} {values.consignee?.lastName}</p>
                      {values.consignee?.personalId && <p>{values.consignee.personalId}</p>}
                    </>
                  )}
                  <p>{values.consignee?.address}</p>
                  <p>{values.consignee?.city}, {values.consignee?.stateProvince} {values.consignee?.zipCode}</p>
                  <p>{values.consignee?.country}</p>
                  <p>{values.consignee?.phone}</p>
                  <p>{values.consignee?.email}</p>
                </div>
              </div>
            </div>

            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item #</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {values.items?.map((item: any, index: number) => {
                    const price = parseFloat(item.price || "0");
                    const quantity = parseFloat(item.quantity || "0");
                    const amount = price * quantity;

                    return (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.itemNumber}</td>
                        <td className="py-2">
                          <div>
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full mr-2 ${
                              item.condition === "new" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {item.condition === "new" ? "New" : "Used"}
                            </span>
                            {item.description}
                          </div>
                        </td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">{formatPrice(price, currency)}</td>
                        <td className="text-right py-2">{formatPrice(amount, currency)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="text-right py-4 font-semibold">Total:</td>
                    <td className="text-right py-4 font-semibold">{formatPrice(total, currency)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="text-sm">
              <h3 className="font-semibold mb-2">Payment Instructions</h3>
              <p>Please include invoice number on your payment.</p>
              <p>Payment is due within 30 days.</p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}