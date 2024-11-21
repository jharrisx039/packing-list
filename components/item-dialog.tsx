"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Currency } from "@/lib/utils";

const itemSchema = z.object({
  itemNumber: z.string(),
  packagingType: z.string().min(1, "Required"),
  condition: z.enum(["new", "used"]).default("new"),
  description: z.string().min(1, "Required"),
  length: z.string().min(1, "Required"),
  width: z.string().min(1, "Required"),
  height: z.string().min(1, "Required"),
  weight: z.string().min(1, "Required"),
  quantity: z.string().min(1, "Required"),
  price: z.string().min(1, "Required"),
  remarks: z.string().optional(),
});

const packagingTypes = [
  "Box",
  "Bale",
  "Bag",
  "Pallet",
  "Crate",
  "Drum",
  "Barrel",
  "Carton",
  "Sack",
  "Container",
  "Bundle",
  "Tub",
  "Canister",
  "Envelope",
  "Roll",
  "Other"
];

const defaultFormValues = {
  itemNumber: "",
  packagingType: "",
  condition: "new",
  description: "",
  length: "",
  width: "",
  height: "",
  weight: "",
  quantity: "",
  price: "",
  remarks: "",
};

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof itemSchema>) => void;
  defaultValues?: z.infer<typeof itemSchema>;
  currentItemCount: number;
  measurementUnit: "metric" | "imperial";
  currency: Currency;
}

export function ItemDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  currentItemCount,
  measurementUnit,
  currency
}: ItemDialogProps) {
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        form.reset(defaultValues);
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (data: z.infer<typeof itemSchema>) => {
    const itemNumber = defaultValues?.itemNumber || `${(currentItemCount + 1).toString().padStart(3, '0')}`;
    onSubmit({ ...data, itemNumber });
    form.reset(defaultFormValues);
  };

  const unit = measurementUnit === "metric" ? "cm" : "in";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit Item" : `Add Item #${(currentItemCount + 1).toString().padStart(3, '0')}`}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="packagingType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Package Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select package type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {packagingTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <div className="flex justify-center space-x-2 p-1 bg-muted rounded-lg">
                      <Toggle
                        pressed={field.value === "new"}
                        onPressedChange={() => field.onChange("new")}
                        className="data-[state=on]:bg-black data-[state=on]:text-white hover:text-white hover:bg-black/90"
                      >
                        New
                      </Toggle>
                      <Toggle
                        pressed={field.value === "used"}
                        onPressedChange={() => field.onChange("used")}
                        className="data-[state=on]:bg-black data-[state=on]:text-white hover:text-white hover:bg-black/90"
                      >
                        Used
                      </Toggle>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length ({unit})</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width ({unit})</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height ({unit})</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight ({measurementUnit === "metric" ? "kg" : "lb"})</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ({currency.symbol})</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Add any additional notes or remarks here"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{defaultValues ? "Save Changes" : "Add Item"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}