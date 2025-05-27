import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ReceiveFundsProps {
  address: string;
}

export function ReceiveFunds({ address }: ReceiveFundsProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Card className="p-4 bg-white">
          <QRCodeSVG value={address} size={200} />
        </Card>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-500">Your Address</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">
            {address}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
