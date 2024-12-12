import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text,setText] = useState("");

  useEffect(() => {
    const runCoco = async () => {
      const net = await cocossd.load();
      console.log("Handpose model loaded.");
      //  Loop and detect hands
      setInterval(() => {
        detect(net);
      }, 10);
    };

    const detect = async (net: cocossd.ObjectDetection) => {
      // Check data is available
      if (
        webcamRef.current !== null &&
        webcamRef.current?.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Set canvas height and width
        canvasRef.current!.width = videoWidth;
        canvasRef.current!.height = videoHeight;

        // Make Detections
        const obj = await net.detect(video);
        // console.log(obj);

        // Draw mesh
        const ctx = canvasRef.current!.getContext("2d")!;
        // drawRect(obj, ctx);
        obj.forEach((prediction) => {

          // Extract boxes and classes
          const [x, y, width, height] = prediction['bbox'];
          const text = prediction['class'];
          setText(text);
    
          // Set styling
          const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
          ctx.strokeStyle = color;
          ctx.font = '18px Arial';
    
          // Draw rectangles and text
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.fillText(text, x, y);
          ctx.rect(x, y, width, height);
          ctx.stroke();
        });
      }
    };

    runCoco();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            // marginLeft: "auto",
            marginRight: "auto",
            left: 5,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            // marginLeft: "auto",
            marginRight: "auto",
            left: 5,
            right: 0,
            textAlign: "center",
            zIndex: 20,
            width: 640,
            height: 480,
          }}
        />
        <h1 className=" absolute top-6 left-10 z-auto">{text}</h1>
      </header>
    </div>
  );
}

export default App;

