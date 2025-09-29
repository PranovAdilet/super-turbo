"use client";

import React from "react";
import { useMDXComponent } from "next-contentlayer2/hooks";
import { FeatureGrid } from "./feature-grid";
import { Feature } from "./feature";
import { Steps } from "./steps";
import { Step } from "./step";
import { CTABox } from "./cta-box";
import { Button } from "@turbo-super/ui";
import { Check } from "lucide-react";
import { PricingSection } from "./pricing-section";
import { VideoShowcase } from "@/components/landing/video-showcase";
import { SimpleVeo3Generator } from "./simple-veo3-generator";
import { CodeBlock } from "@/components/ui/code-block";
import { InteractiveAPIDocs } from "./interactive-api-docs";

// Минимальное определение компонентов для проверки работоспособности
const components = {
  h1: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={`text-4xl font-bold mt-8 mb-4 ${className ?? ""}`}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={`text-3xl font-bold mt-8 mb-4 ${className ?? ""}`}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={`text-2xl font-bold mt-8 mb-4 ${className ?? ""}`}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={`my-4 leading-7 ${className ?? ""}`}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={`list-disc pl-6 my-4 ${className ?? ""}`}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={`list-decimal pl-6 my-4 ${className ?? ""}`}
      {...props}
    />
  ),
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={`border-l-4 border-primary pl-4 italic my-6 ${className ?? ""}`}
      {...props}
    />
  ),
  pre: ({
    className,
    children,
    ..._props
  }: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock className={className}>{children}</CodeBlock>
  ),
  FeatureGrid,
  Feature,
  Steps,
  Step,
  CTABox,
  Button,
  Check,
  PricingSection,
  VideoShowcase,
  SimpleVeo3Generator,
  InteractiveAPIDocs,
};

interface MDXProps {
  code: string;
}

export function MDXContent({ code }: MDXProps) {
  // Ensure process is available for ContentLayer2
  if (
    typeof window !== "undefined" &&
    typeof (window as Window & { process?: unknown }).process === "undefined"
  ) {
    (window as Window & { process: { env: Record<string, unknown> } }).process =
      { env: {} };
  }

  const MDXComponent = useMDXComponent(code);
  return <MDXComponent components={components} />;
}
