"use client";

import { useEffect } from "react";
import { usePollar } from "@pollar/react";
import { RemittanceSteps, type RemittanceStepsProps } from "./remittance-steps";
import { unavailableAuth, useRemittanceAuth } from "./use-remittance-auth";

function AuthenticatedFlow(props: RemittanceStepsProps) {
  const auth = useRemittanceAuth();
  const client = usePollar().getClient();
  useEffect(() => () => client.cancelLogin(), [client]);
  return <RemittanceSteps {...props} onClose={() => { client.cancelLogin(); props.onClose(); }} auth={auth} />;
}

export default function RemittanceFlow(props: RemittanceStepsProps) {
  if (!process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY) return <RemittanceSteps {...props} auth={unavailableAuth} />;
  return <AuthenticatedFlow {...props} />;
}
