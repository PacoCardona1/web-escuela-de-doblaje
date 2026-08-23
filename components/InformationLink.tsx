"use client";

import type { MouseEvent, ReactNode } from "react";
import { informationInterestEvent, type TrainingInterest } from "../config/information";

type InformationLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  interest: Exclude<TrainingInterest, "">;
};

export function InformationLink({ children, className, href, interest }: InformationLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const destination = new URL(href, window.location.href);
    window.history.pushState({}, "", destination);
    window.dispatchEvent(new CustomEvent(informationInterestEvent, { detail: interest }));
    document.getElementById("informacion")?.scrollIntoView();
  }

  return <a className={className} href={href} onClick={handleClick}>{children}</a>;
}
