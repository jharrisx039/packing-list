"use client";

import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Control, UseFieldArrayReturn } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ItemDialog } from "./item-dialog";
import { useState } from "react";
import { ExcelImport } from "./excel-import";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDimensions, formatNumber, formatPrice, calculateCBM, calculateCFT, convertDimensions, type Currency } from "@/lib/utils";

interface ItemListProps {
  control: Control<any>;
  fieldArray: UseFieldArrayReturn<any, "items", "id">;
  measurementUnit: "metric" | "imperial";
  currency: Currency;
}

export function ItemList({ control, fieldArray, measurementUnit, currency }: ItemListProps) {
  const { fields, append, update, remove } = fieldArray;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ index: number; data: any } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const isMetric = measurementUnit === "metric";

  const handleEdit = (index: number, data: any) => {
    setEditingItem({ index, data });
    setDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingItem !== null) {
      update(editingItem.index, data);
      setEditingItem(null);
    } else {
      append(data);
    }
    setDialogOpen(false);
  };

  const handleImport = (items: any[]) => {
    items.forEach(item => append(item));
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      remove(deleteIndex);
    }
    setDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  return (
    <div className="space-y-3">
      {fields.map((field, index) => {
        const dims = {
          length: parseFloat(field.length),
          width: parseFloat(field.width),
          height: parseFloat(field.height),
        };
        const weight = parseFloat(field.weight);
        const convertedDims = convertDimensions(dims, isMetric ? "metric" : "imperial");
        const convertedWeight = isMetric ? weight * 2.20462 : weight * 0.453592;
        const quantity = parseInt(field.quantity);
        const price = parseFloat(field.price || "0");
        const totalPrice = price * quantity;

        // Calculate volumes
        const cbm = calculateCBM(isMetric ? dims : convertedDims);
        const cft = calculateCFT(isMetric ? convertedDims : dims);
        const totalCBM = cbm * quantity;
        const totalCFT = cft * quantity;

        // Calculate total weights
        const totalWeight = weight * quantity;
        const totalConvertedWeight = convertedWeight * quantity;

        return (
          <Card key={field.id} className="group">
            <CardHeader className="p-4 flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Item #{field.itemNumber}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{field.packagingType}</span>
                {field.condition && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      field.condition === "new" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {field.condition === "new" ? "New" : "Used"}
                    </span>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEdit(index, field)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{field.description}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      {quantity} × {formatPrice(price, currency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(totalPrice, currency)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Dimensions:</div>
                    <div className="text-sm">{formatDimensions(dims, isMetric ? "cm" : "in")}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDimensions(convertedDims, isMetric ? "in" : "cm")}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Weight:</div>
                    <div className="text-sm">
                      {formatNumber(weight)} {isMetric ? "kg" : "lb"}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({formatNumber(convertedWeight)} {isMetric ? "lb" : "kg"})
                      </span>
                    </div>
                    <div className="text-sm mt-1">
                      Total: {formatNumber(totalWeight)} {isMetric ? "kg" : "lb"}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({formatNumber(totalConvertedWeight)} {isMetric ? "lb" : "kg"})
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Volume:</div>
                    <div className="text-sm">
                      {formatNumber(cft)} CFT
                      <span className="text-xs text-muted-foreground ml-1">
                        ({formatNumber(cbm)} CBM)
                      </span>
                    </div>
                    <div className="text-sm mt-1">
                      Total: {formatNumber(totalCFT)} CFT
                      <span className="text-xs text-muted-foreground ml-1">
                        ({formatNumber(totalCBM)} CBM)
                      </span>
                    </div>
                  </div>
                </div>

                {field.remarks && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Remarks:</span> {field.remarks}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingItem(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>

        <ExcelImport onImport={handleImport} />
      </div>

      <ItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={editingItem?.data}
        currentItemCount={fields.length}
        measurementUnit={measurementUnit}
        currency={currency}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item from the packing list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}