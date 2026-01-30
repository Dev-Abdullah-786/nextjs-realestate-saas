"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@nextui-org/react";

function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();
  return <Button {...props} disabled={pending} isLoading={pending}></Button>;
}

export default SubmitButton;
