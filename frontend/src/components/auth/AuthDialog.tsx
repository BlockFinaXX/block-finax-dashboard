"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function AuthDialog({ isOpen, onClose, children }: AuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">{children}</DialogContent>
    </Dialog>
  );
}
