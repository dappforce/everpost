// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import Post4Ever from "public/images/Post4Ever.svg";
import HeroSection from "./landing/HeroSection";

import React from "react";

import Button from "./Button";
import Container from "./Container";
import { useSendGaUserEvent } from "src/utils/ga/events";

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  const sendGaEvent = useSendGaUserEvent();
  const onEnterAppClick = () => {
    sendGaEvent("Click on Enter App button");
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 bg-white py-4">
        <Container className="flex items-center justify-between">
          <Post4Ever className="h-3.5 md:h-4" />
          <div>
            <Button href="/crosspost" target="_blank" onClick={onEnterAppClick}>
              Enter App
            </Button>
          </div>
        </Container>
      </header>
      <main className="flex flex-1 flex-col overflow-x-hidden bg-light-gray">
        <HeroSection />
        <div className="flex flex-1 flex-col items-center justify-center bg-light-gray py-10">
          {children}
        </div>
      </main>
      <footer className="z-10 mt-auto flex w-full items-center bg-white py-8">
        <Container className="flex justify-center md:justify-start">
          <Post4Ever className="h-4" />
        </Container>
      </footer>
    </div>
  );
};

export default HomeLayout;
