"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ItemList } from "./item-list";
import { Preview } from "./preview";
import { PartyCard } from "./party-card";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CURRENCIES, type Currency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

const partySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("company"),
    companyName: z.string().min(1, "Company name is required"),
    taxId: z.string().min(1, "Tax ID is required"),
    personalId: z.string().optional(),
    firstName: z.string().min(2, "Required"),
    lastName: z.string().min(2, "Required"),
    address: z.string().min(5, "Required"),
    city: z.string().min(2, "Required"),
    stateProvince: z.string().min(2, "Required"),
    zipCode: z.string().min(2, "Required"),
    country: z.string().min(2, "Required"),
    phone: z.string().min(5, "Required"),
    email: z.string().email("Invalid email"),
  }),
  z.object({
    type: z.literal("individual"),
    companyName: z.string().optional(),
    taxId: z.string().optional(),
    personalId: z.string().min(1, "Personal ID is required"),
    firstName: z.string().min(2, "Required"),
    lastName: z.string().min(2, "Required"),
    address: z.string().min(5, "Required"),
    city: z.string().min(2, "Required"),
    stateProvince: z.string().min(2, "Required"),
    zipCode: z.string().min(2, "Required"),
    country: z.string().min(2, "Required"),
    phone: z.string().min(5, "Required"),
    email: z.string().email("Invalid email"),
  }),
]);

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
  price: z.string().optional(),
  remarks: z.string().optional(),
});

const formSchema = z.object({
  consignee: partySchema,
  shipper: partySchema,
  items: z.array(itemSchema),
});

export default function PackingListForm() {
  const [measurementUnit, setMeasurementUnit] = useState<"metric" | "imperial">("metric");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consignee: {
        type: "individual",
        companyName: "",
        taxId: "",
        personalId: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        stateProvince: "",
        zipCode: "",
        country: "",
        phone: "",
        email: "",
      },
      shipper: {
        type: "individual",
        companyName: "",
        taxId: "",
        personalId: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        stateProvince: "",
        zipCode: "",
        country: "",
        phone: "",
        email: "",
      },
      items: [],
    },
  });

  const itemsArray = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">
        <div className="flex-1 space-y-4 max-w-[600px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex justify-center space-x-2 p-1 bg-muted rounded-lg">
              <Toggle
                pressed={measurementUnit === "metric"}
                onPressedChange={() => setMeasurementUnit("metric")}
                className="data-[state=on]:bg-black data-[state=on]:text-white hover:text-white hover:bg-black/90"
              >
                Metric
              </Toggle>
              <Toggle
                pressed={measurementUnit === "imperial"}
                onPressedChange={() => setMeasurementUnit("imperial")}
                className="data-[state=on]:bg-black data-[state=on]:text-white hover:text-white hover:bg-black/90"
              >
                Imperial
              </Toggle>
            </div>

            <Select
              value={selectedCurrency.code}
              onValueChange={(value) => {
                const currency = CURRENCIES.find((c) => c.code === value);
                if (currency) setSelectedCurrency(currency);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol}) - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PartyCard
              title="Shipper"
              data={form.watch("shipper")}
              onSave={(data) => form.setValue("shipper", data)}
            />
            <PartyCard
              title="Consignee"
              data={form.watch("consignee")}
              onSave={(data) => form.setValue("consignee", data)}
            />
          </div>

          <div className="bg-white rounded-lg border h-[calc(100vh-20rem)] overflow-hidden">
            <ScrollArea className="h-full p-4">
              <ItemList 
                control={form.control} 
                fieldArray={itemsArray}
                measurementUnit={measurementUnit}
                currency={selectedCurrency}
              />
            </ScrollArea>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Create Packing List</Button>
          </div>
        </div>

        <div className="flex-1 sticky top-6">
          <Preview 
            form={form} 
            measurementUnit={measurementUnit}
            currency={selectedCurrency}
          />
        </div>
      </form>
    </Form>
  );
}