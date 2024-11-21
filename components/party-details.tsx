"use client";

import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface PartyDetailsProps {
  control: Control<any>;
  prefix: "consignee" | "shipper";
}

export function PartyDetails({ control, prefix }: PartyDetailsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <FormField
        control={control}
        name={`${prefix}.firstName`}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs text-muted-foreground">First Name</FormLabel>
            <FormControl>
              <Input {...field} className="h-8" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.lastName`}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs text-muted-foreground">Last Name</FormLabel>
            <FormControl>
              <Input {...field} className="h-8" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.email`}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs text-muted-foreground">Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" className="h-8" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.phone`}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs text-muted-foreground">Phone</FormLabel>
            <FormControl>
              <Input {...field} type="tel" className="h-8" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.address`}
        render={({ field }) => (
          <FormItem className="space-y-1 col-span-2">
            <FormLabel className="text-xs text-muted-foreground">Address</FormLabel>
            <FormControl>
              <Input {...field} className="h-8" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.city`}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs text-muted-foreground">City</FormLabel>
            <FormControl>
              <Input {...field} className="h-8" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.stateProvince`}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs text-muted-foreground">State/Province</FormLabel>
            <FormControl>
              <Input {...field} className="h-8" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.zipCode`}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs text-muted-foreground">Zip Code</FormLabel>
            <FormControl>
              <Input {...field} className="h-8" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.country`}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs text-muted-foreground">Country</FormLabel>
            <FormControl>
              <Input {...field} className="h-8" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
}