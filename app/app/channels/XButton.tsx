"use client";
import { Button } from "@/components/ui/button";

export default function XButton(props: { action: () => Promise<void> }) {
  return <Button onClick={() => props.action()}>X</Button>;
}
