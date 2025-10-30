import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFoundPage: React.FC = () => {
  const [fill, setFill] = useState(90);
  const [isGameActive, setIsGameActive] = useState(true);
  const [fishClasses, setFishClasses] = useState('fishbowl__fish');
  const [tapActive, setTapActive] = useState(false);
  const fishbowlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let intervalId: number | null = null;
    if (isGameActive) {
      intervalId = window.setInterval(() => {
        setFill(prevFill => {
          const newFill = prevFill - 1;
          if (newFill <= 0) {
            setIsGameActive(false);
            return 0;
          }
          return newFill;
        });
      }, 200);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGameActive]);

  useEffect(() => {
    if (fishbowlRef.current) {
      fishbowlRef.current.style.setProperty('--filling', String(fill));
    }

    if (fill <= 0) {
      setFishClasses('fishbowl__fish fishbowl__fish--dead fishbowl__fish--floating');
    } else if (fill < 20) {
      setFishClasses('fishbowl__fish fishbowl__fish--dead');
    } else if (fill < 50) {
      setFishClasses('fishbowl__fish fishbowl__fish--dying');
    } else {
      setFishClasses('fishbowl__fish');
    }
  }, [fill]);

  const handleTapClick = () => {
    setTapActive(true);
    setTimeout(() => setTapActive(false), 500);

    if (!isGameActive && fill <= 0) {
      setIsGameActive(true);
    }

    setFill(prevFill => Math.min(prevFill + 20, 90));
  };

  const css = `
    .fishbowl {
      position: relative;
      width: 15rem;
      height: 15rem;
    }
    .fishbowl__background {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50% 50% 40% 40%;
      background: linear-gradient(transparent 10%, #FFF 150%);
      border-bottom: 1px solid #FFF;
    }
    .fishbowl:before {
      content: "";
      position: absolute;
      bottom: 9.5rem;
      left: 2rem;
      width: 100%;
      height: 30%;
      border-radius: 50%;
      box-shadow: -4rem 10rem 1rem 0 rgba(0, 0, 56, 0.3);
      transform: rotate(5deg);
    }
    .fishbowl:after {
      content: "";
      position: absolute;
      top: 12.5%;
      left: 2.5%;
      width: 95%;
      height: 85%;
      border-radius: 40%;
      background: linear-gradient(135deg, transparent 50%, #FFF 150%);
    }
    .fishbowl__bottom {
      position: absolute;
      bottom: 5%;
      left: 17.5%;
      width: 65%;
      height: 20%;
      border-radius: 50%;
      background: linear-gradient(#F5FCCD, #ff7d66 200%);
    }
    .fishbowl__decoration {
      position: absolute;
      top: 20%;
      left: 5%;
      width: 90%;
      height: 75%;
    }
    .fishbowl__seaweed {
      position: absolute;
      width: 0;
      height: 0;
      border-left: 0.5rem solid transparent;
      border-right: 0.5rem solid transparent;
      border-bottom: 5rem solid #80c0a1;
    }
    .fishbowl__seaweed--1 {
      bottom: 15%;
      right: 20%;
      border-bottom: 5rem solid #80c0a1;
    }
    .fishbowl__seaweed--2 {
      bottom: 10%;
      right: 30%;
      border-bottom: 8rem solid #80c0a1;
    }
    .fishbowl__seaweed--3 {
      bottom: 15%;
      right: 40%;
      border-bottom: 6rem solid #80c0a1;
    }
    .fishbowl__water {
      position: absolute;
      bottom: 5%;
      left: 5%;
      width: 90%;
      height: 80%;
      border-radius: 40% 40% 4.8rem 4.8rem;
      transition: height 0.3s ease;
      overflow: hidden;
    }
    .fishbowl__water-color {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: calc(1% * var(--filling, 90));
      background: linear-gradient(transparent -50%, #419197 250%);
      border-radius: 20% 20% 4rem 4rem;
      transition: height 0.5s linear;
    }
    .fishbowl__water-color:after {
      content: "";
      position: absolute;
      top: 0;
      left: 5%;
      width: 90%;
      height: 3rem;
      border-radius: 50%;
      background: linear-gradient(transparent 0%, #419197 250%);
      box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.5);
    }
    .fishbowl__top {
      position: absolute;
      top: 5%;
      left: 15%;
      width: 70%;
      height: 20%;
      border-radius: 50%;
      box-shadow: 0 2px 2px 3px rgba(255, 255, 255, 0.3);
    }
    .fishbowl__fish {
      position: absolute;
      bottom: 25%;
      left: 18%;
      width: 2rem;
      height: 1rem;
      border-radius: 50%;
      background: linear-gradient(#FFF -200%, orange);
      box-shadow: 0 2rem 4px -2px rgba(0, 0, 56, 0.3);
      transition-property: bottom, transform, box-shadow;
      transition-duration: 1s;
      transition-timing-function: ease;
      animation: swimming 5s infinite forwards;
    }
    .fishbowl__fish:after {
      content: "";
      position: absolute;
      top: 15%;
      right: 15%;
      width: 0.25rem;
      height: 0.25rem;
      border-radius: 50%;
      background: radial-gradient(circle at 0 0, #FFF -100%, #12486B);
      transition: height 0.5s ease;
    }
    .fishbowl__fish--dying {
      bottom: 10%;
      box-shadow: 0 1rem 4px -2px rgba(0, 0, 56, 0.3);
    }
    .fishbowl__fish--dying .fishbowl__fish-tail {
      box-shadow: 0 1rem 4px -2px rgba(0, 0, 56, 0.3);
    }
    .fishbowl__fish--dead {
      animation: dead 2s 2 forwards;
      box-shadow: none;
    }
    .fishbowl__fish--dead .fishbowl__fish-tail {
      box-shadow: none;
    }
    .fishbowl__fish--dead:after {
      height: 0.125rem;
    }
    .fishbowl__fish--floating {
      bottom: max(calc(var(--filling, 0) * 1% - 15%), 10%);
      transform: translateX(2.5rem);
      animation: none;
      box-shadow: none;
    }
    .fishbowl__fish--floating:after {
      height: 2px;
    }
    .fishbowl__fish--floating .fishbowl__fish-tail {
      box-shadow: none;
    }
    .fishbowl__fish-tail {
      position: absolute;
      top: 0;
      left: -0.75rem;
      width: 0;
      height: 0;
      border-top: 0.5rem solid transparent;
      border-bottom: 0.5rem solid transparent;
      border-left: 0.94rem solid orange;
      box-shadow: 0 2rem 4px -2px rgba(0, 0, 56, 0.3);
      transition: box-shadow 1s ease;
    }
    .fishbowl__pool {
      position: absolute;
      right: 0;
      bottom: -5%;
      width: 50%;
      height: 15%;
      border-radius: 50%;
      background: linear-gradient(#FFF -100%, #419197);
      opacity: 0.5;
    }
    .fishbowl__pool:after {
      content: "";
      position: absolute;
      top: 25%;
      left: 25%;
      width: 50%;
      height: 50%;
      border-right: 2px solid #FFF;
      border-radius: 50%;
      animation: wave 3s infinite;
      opacity: 0.5;
    }
    .fishbowl__tap {
      position: absolute;
      bottom: 0;
      left: -3rem;
      width: 12rem;
      height: 15.9rem;
      cursor: pointer;
    }
    .fishbowl__tap--active .fishbowl__tap-stream {
      animation: stream 0.5s;
    }
    .fishbowl__tap--active .fishbowl__tap-handle {
      animation: handle 0.5s;
    }
    .fishbowl__tap-base {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 2rem;
      height: 14rem;
      border-radius: 0 0 1.2rem 1.2rem;
      box-shadow: inset -1px -1px 0 0px rgba(255, 255, 255, 0.5);
      background: linear-gradient(#919ea3, #66777F 150%);
    }
    .fishbowl__tap-base:before {
      content: "";
      position: absolute;
      z-index: -1;
      bottom: 4rem;
      right: 15rem;
      width: 100%;
      height: 100%;
      border-radius: 1rem 1rem 0 0;
      box-shadow: -4rem 10rem 1rem 0 rgba(0, 0, 56, 0.3);
      transform: rotate(-70deg);
    }
    .fishbowl__tap-base:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4) 60%, transparent 200%);
      border-radius: 0 0 1.2rem 1.2rem;
    }
    .fishbowl__tap-handle {
      position: absolute;
      left: -1rem;
      bottom: 6rem;
      width: 2rem;
      height: 2rem;
      border-radius: 0.2rem;
      border-top: 1px solid #FFF;
      border-right: 1px solid rgba(255, 255, 255, 0.5);
      background: radial-gradient(circle at 0 0, #FFF -100%, #919ea3);
      transform: rotate(45deg);
    }
    .fishbowl__tap-handle:after {
      content: "";
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: radial-gradient(circle at 0 0, #FFF -200%, #419197);
    }
    .fishbowl__tap-stream {
      position: absolute;
      top: 2rem;
      left: 6.25rem;
      width: 1.5rem;
      height: 0;
      background: linear-gradient(#FFF -100%, #419197);
      border-radius: 1rem;
      opacity: 0.3;
    }
    .fishbowl__tap-head {
      position: absolute;
      top: 0;
      left: 0;
      width: 4rem;
      height: 0rem;
      border-radius: 50% 50% 0 0;
      border-top: 2rem solid #919ea3;
      border-left: 2rem solid #919ea3;
      border-right: 2rem solid #919ea3;
      box-shadow: 1px -1px 0 0 #FFF;
    }
    .fishbowl__tap-head:before {
      content: "";
      position: absolute;
      z-index: -1;
      bottom: 3rem;
      right: 23rem;
      width: 150%;
      height: 200%;
      box-shadow: -4rem 10rem 1rem 1rem rgba(0, 0, 56, 0.3);
      transform: rotate(2deg) skewX(60deg);
    }
    .fishbowl__tap-head:after {
      content: "";
      position: absolute;
      top: -2rem;
      left: -2rem;
      width: 8rem;
      height: 2rem;
      background: linear-gradient(transparent, rgba(255, 255, 255, 0.4) 60%, transparent 200%);
      border-radius: 50% 50% 0 50%;
    }
    .fishbowl__tap-end {
      position: absolute;
      left: 6rem;
      top: 1.5rem;
      width: 2rem;
      height: 1rem;
      border-radius: 50%;
      background: linear-gradient(#FFF -70%, #919ea3);
    }
    .fishbowl__tap-text {
      position: absolute;
      top: 4rem;
      left: -6rem;
      color: #FFF;
      font-family: "Arial", sans-serif;
      font-size: 0.875rem;
    }
    .fishbowl__tap-text:after {
      content: "";
      position: absolute;
      bottom: -1rem;
      right: -1rem;
      width: 2rem;
      height: 1px;
      background-color: #FFF;
      transform: rotate(45deg);
    }

    @keyframes swimming {
      0%, 100% { transform: translateX(0); }
      22.5% { transform: translateX(2.5rem) skewY(-5deg); }
      45% { transform: translateX(6rem) translateY(-1rem) skewY(5deg); }
      55% { transform: translateX(5rem) translateY(-0.5rem) scaleX(-1); }
      95% { transform: translateX(0) scaleX(-1) skewY(10deg); }
    }
    @keyframes dead {
      0%, 100% { transform: translateX(2.5rem); }
      22.5% { transform: translateX(2.5rem) translateY(-1rem) skewY(-5deg); }
      45% { transform: translateX(2.5rem) skewY(5deg); }
      55% { transform: translateX(2.5rem) translateY(-1rem) skewY(-5deg); }
      95% { transform: translateX(2.5rem) skewY(5deg); }
    }
    @keyframes wave {
      from { top: 25%; left: 25%; width: 50%; height: 50%; }
      to { top: 10%; left: 10%; width: 80%; height: 80%; }
    }
    @keyframes stream {
      0% { height: 0; }
      50% { top: 2rem; height: calc(14rem - var(--filling) * 0.1rem); }
      100% { top: calc(2rem + 14rem - var(--filling) * 0.1rem); height: 0; }
    }
    @keyframes handle {
      from { transform: rotate(45deg); }
      to { transform: rotate(405deg); }
    }
  `;
  // FIX: Added JSX return value to the component to render the 404 page.
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden">
        <style>{css}</style>
        <h1 className="text-6xl font-bold tracking-tighter">404</h1>
        <p className="text-xl mt-2 mb-8">Oops! Looks like this page is lost at sea.</p>
        <div className="relative">
            <div ref={fishbowlRef} className="fishbowl">
                <div className="fishbowl__pool"></div>
                <div className="fishbowl__background"></div>
                <div className="fishbowl__bottom"></div>
                <div className="fishbowl__decoration">
                    <div className="fishbowl__seaweed fishbowl__seaweed--1"></div>
                    <div className="fishbowl__seaweed fishbowl__seaweed--2"></div>
                    <div className="fishbowl__seaweed fishbowl__seaweed--3"></div>
                </div>
                <div className="fishbowl__water">
                    <div className="fishbowl__water-color"></div>
                </div>
                <div className={fishClasses}>
                    <div className="fishbowl__fish-tail"></div>
                </div>
                <div className="fishbowl__top"></div>
            </div>
            <div
                className={`fishbowl__tap ${tapActive ? 'fishbowl__tap--active' : ''}`}
                onClick={handleTapClick}
            >
                <div className="fishbowl__tap-base"></div>
                <div className="fishbowl__tap-handle"></div>
                <div className="fishbowl__tap-stream"></div>
                <div className="fishbowl__tap-head"></div>
                <div className="fishbowl__tap-end"></div>
                <div className="fishbowl__tap-text">Click to add water</div>
            </div>
        </div>
        <p className="mt-8 text-sm text-indigo-200">Help the fish! Its water is draining.</p>
        <Link to="/"><Button variant="secondary" className="mt-4 !bg-white/20 !border-white/50 !text-white hover:!bg-white/30">Go back home</Button></Link>
    </main>
  );
};

export default NotFoundPage;
