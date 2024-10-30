import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import Joyride, { STATUS } from 'react-joyride';
import FloatingMenu from './components/FloatingMenu';
import AutoTilt from './components/AutoTilt';
import GridHeader from './components/GridHeader';
import ThemeToggle from './components/ThemeToggle';
import { preloadImages, initializeCanvas } from './canvasAnimation';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const spriteNames = [
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Anger-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Fear-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Sadness-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Worry-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Regret-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Happiness-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-SpreadingHappiness-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-PosAnticipation-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-NegAnticipation-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-ThreeLoves-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Pride-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Shame-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Surprise-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Disgust-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Embarrassed-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Stress-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Relief-Face.png',
  'https://qemqgbsrfkfkgtqpvurb.supabase.co/storage/v1/object/public/mhhGop1/MHHsprites/Final-Meditation1-Face.png',
];

const generateRandomData = () => {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 100));
};

const generateChartData = () => {
  const data = generateRandomData();
  return {
    labels: [],
    datasets: [
      {
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
};

const ChartComponent = ({ type }) => {
  const ChartType = type === 'pie' ? Pie : Doughnut;
  return <ChartType data={generateChartData()} />;
};

export function App() {
  const gridRef = useRef(null);
  const canvasRefs = useRef([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [runTutorial, setRunTutorial] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [message, setMessage] = useState('');
  const [currentMediaQuery, setCurrentMediaQuery] = useState('');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [{ y }, set] = useSpring(() => ({ y: 0 }));
  const bind = useGesture({
    onDrag: ({ down, movement: [, my], distance, cancel }) => {
      if (down && distance > window.innerHeight / 2) cancel();
      set({ y: down ? my : 0, immediate: down });
    },
    onWheel: ({ movement: [, my] }) => {
      set({ y: my, immediate: false });
    },
  });

  const [steps] = useState([
    {
      target: '.grid-header',
      content: 'These headers show different levels and badges for each emotion',
      placement: 'bottom',
    },
    {
      target: '.sprite-cell',
      content: 'Each emotion is represented by a unique character',
      placement: 'right',
    },
    {
      target: '.chart-cell',
      content: 'Charts show progress and metrics for each emotion',
      placement: 'left',
    },
    {
      target: '.canvas-cell',
      content: 'Interactive animations show achievements and rewards',
      placement: 'left',
    },
    {
      target: '.theme-toggle',
      content: 'Toggle between light and dark mode for comfortable viewing',
      placement: 'left',
    },
    {
      target: '.play-button',
      content: 'Control the animation of emotion characters',
      placement: 'top',
    }
  ]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTutorial(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      if (width < 600) {
        setCurrentMediaQuery('Small Screen (Phone)');
      } else if (width < 900) {
        setCurrentMediaQuery('Medium Screen (Tablet)');
      } else {
        setCurrentMediaQuery('Large Screen (Desktop)');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    preloadImages().then(() => {
      canvasRefs.current.forEach((canvas) => {
        if (canvas) {
          initializeCanvas(canvas, 15, '#FF0000', true);
        }
      });
    });
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const renderFrame = (rowIndex, frameIndex) => {
    if (frameIndex === 0) {
      const spriteName = spriteNames[rowIndex % spriteNames.length];
      return (
        <div className="sprite-cell relative">
          <AutoTilt>
            <img
              id={spriteName}
              src={spriteName}
              alt={spriteName.split('/').pop()}
              className="sprite-image mt-8"
            />
          </AutoTilt>
          <div className="sprite-label absolute bottom-4 left-0 right-0 text-lg font-bold z-10">
            {spriteName.split('/').pop().split('-')[1]}
          </div>
        </div>
      );
    } else if (frameIndex < 4) {
      return (
        <div className="chart-cell">
          <ChartComponent type={frameIndex % 2 === 0 ? 'pie' : 'doughnut'} />
        </div>
      );
    } else {
      return (
        <div className="canvas-cell">
          <canvas
            ref={(el) => {
              if (el) canvasRefs.current.push(el);
            }}
            className="animation-canvas"
          ></canvas>
        </div>
      );
    }
  };

  return (
    <div id="outer-container" className={isDarkMode ? 'dark' : ''}>
      <Joyride
        steps={steps}
        run={runTutorial}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#4a5568',
            zIndex: 1000,
          },
        }}
      />
      
      <FloatingMenu />
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="container">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Mind Hacking Happiness dashboard v.1
        </h2>

        <GridHeader />
        
        <animated.div
          {...bind()}
          style={{
            transform: y.to((y) => `translateY(${y}px)`),
            height: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          <div className="scroll-container">
            <div ref={gridRef} className="grid">
              {spriteNames.map((spriteName, index) => (
                <React.Fragment key={index}>
                  {renderFrame(index, 0)}
                  {renderFrame(index, 1)}
                  {renderFrame(index, 2)}
                  {renderFrame(index, 3)}
                  {renderFrame(index, 4)}
                  {renderFrame(index, 5)}
                  {renderFrame(index, 6)}
                </React.Fragment>
              ))}
            </div>
            {message && (
              <div className="message-box">
                {message.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </animated.div>

        <button className="play-button" onClick={togglePlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="media-info dark:text-gray-400">
          Screen Width: {screenWidth}px <br />
          Media Query: {currentMediaQuery}
        </div>
      </div>
    </div>
  );
}

export default App;