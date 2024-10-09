"use client";
import React from "react";
import Lottie from "lottie-react";
import animationData from "/public/animation.json"; // Adjust the path if needed

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
