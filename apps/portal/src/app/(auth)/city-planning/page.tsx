import * as React from "react";
import dynamic from "next/dynamic";

const Index = dynamic(() => import("./_components/index"), { ssr: false });

export default function Page() {
  return <Index />;
}
