"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyDialog } from "./party-dialog";
import { useState } from "react";
import { Pencil, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartyCardProps {
  title: string;
  data: any;
  onSave: (data: any) => void;
}

export function PartyCard({ title, data, onSave }: PartyCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasData = Object.values(data).some((value) => value !== "" && value !== undefined);
  const isCompany = data.type === "company";

  return (
    <>
      <Card className={cn(hasData && "bg-purple-50")}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            {isCompany ? (
              <Building2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="grid gap-1 text-sm">
              {isCompany ? (
                <>
                  <p className="font-medium">{data.companyName}</p>
                  {data.taxId && <p className="text-muted-foreground">{data.taxId}</p>}
                  <p className="font-medium">Contact: {data.firstName} {data.lastName}</p>
                </>
              ) : (
                <>
                  <p className="font-medium">{data.firstName} {data.lastName}</p>
                  {data.personalId && <p className="text-muted-foreground">{data.personalId}</p>}
                </>
              )}
              <p className="text-muted-foreground">{data.address}</p>
              <p className="text-muted-foreground">
                {data.city}, {data.stateProvince} {data.zipCode}
              </p>
              <p className="text-muted-foreground">{data.country}</p>
              <p className="text-muted-foreground">{data.phone}</p>
              <p className="text-muted-foreground">{data.email}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Click edit to add details</p>
          )}
        </CardContent>
      </Card>

      <PartyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => {
          onSave(data);
          setDialogOpen(false);
        }}
        defaultValues={data}
        title={`Edit ${title}`}
      />
    </>
  );
}