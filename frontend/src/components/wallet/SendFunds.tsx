import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { parseEther } from "viem";

const formSchema = z.object({
  recipient: z.string().min(42, "Invalid address").max(42, "Invalid address"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
});

interface SendFundsProps {
  onSend: (recipient: string, amount: bigint) => Promise<void>;
  isLoading?: boolean;
}

export function SendFunds({ onSend, isLoading }: SendFundsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await onSend(values.recipient, parseEther(values.amount));
      form.reset();
    } catch (error) {
      console.error("Error sending funds:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (ETH)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.000000000000000001"
                  placeholder="0.0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </Form>
  );
}
