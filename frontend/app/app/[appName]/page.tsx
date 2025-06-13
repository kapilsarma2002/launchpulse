import React from "react";
import AppLandingContent from "@/components/AppLandingContent";

export default async function AppLandingPage({
  params,
}: {
  params: { appName: string };
}) {

  const appName = (await params).appName;

  return <AppLandingContent appName={appName} />;
}
