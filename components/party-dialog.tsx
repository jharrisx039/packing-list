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
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

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

interface PartyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof partySchema>) => void;
  defaultValues?: z.infer<typeof partySchema>;
  title: string;
}

export function PartyDialog({ open, onOpenChange, onSubmit, defaultValues, title }: PartyDialogProps) {
  const [partyType, setPartyType] = useState<"individual" | "company">(
    defaultValues?.type || "individual"
  );

  const form = useForm<z.infer<typeof partySchema>>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      type: partyType,
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
      ...defaultValues,
    },
  });

  const handleTypeChange = (type: "individual" | "company") => {
    setPartyType(type);
    form.setValue("type", type);
    if (type === "individual") {
      form.setValue("companyName", "");
      form.setValue("taxId", "");
    } else {
      form.setValue("personalId", "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-center space-x-2 p-1 bg-muted rounded-lg w-fit">
              <Toggle
                pressed={partyType === "individual"}
                onPressedChange={() => handleTypeChange("individual")}
                className="data-[state=on]:bg-black data-[state=on]:text-white hover:text-white hover:bg-black/90"
              >
                Individual
              </Toggle>
              <Toggle
                pressed={partyType === "company"}
                onPressedChange={() => handleTypeChange("company")}
                className="data-[state=on]:bg-black data-[state=on]:text-white hover:text-white hover:bg-black/90"
              >
                Company
              </Toggle>
            </div>

            {partyType === "company" ? (
              <>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Identifier ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stateProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}