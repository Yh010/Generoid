"use client";

import { ReactNode, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ComingSoonAlertProps {
  component: ReactNode;
}

export default function ComingSoonAlert({ component }: ComingSoonAlertProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline" className={className}>
          Open Alert
        </Button> */}
        {component}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            Coming Soon
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            We are working hard to bring you something amazing. Stay tuned for
            exciting updates!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
