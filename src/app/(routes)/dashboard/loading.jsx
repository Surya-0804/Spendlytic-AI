"use client";
import React from "react";
import dynamic from "next/dynamic";
import animationData from "@/data/animation.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-[95vh]">
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ height: "450px", width: "450px" }}
      />
    </div>
  );
};

export default Loading;
