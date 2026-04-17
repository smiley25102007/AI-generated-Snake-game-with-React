import React, { useState, useEffect, useCallback, useRef } from 'react';

const TRACKS = [
  { id: 1, title: 'STREAM_0X01.dmp', artist: 'UNKNOWN_ENTITY', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CORE_DUMP.wav', artist: 'SYS_ADMIN', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'NULL_POINTER.exe', artist: 'DAEMON', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="min-h-screen bg-black text-[#0ff] font-system overflow-hidden relative selection:bg-[#f0f] selection:text-black flex flex-col pt-8 lg:pt-16 px-4">
      <div className="static-noise"></div>
      <div className="scanline"></div>
      <div className="crt-overlay"></div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-6 flex-grow pb-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-[#f0f] pb-4 mb-2 gap-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold glitch-text uppercase m-0 leading-none drop-shadow-[4px_4px_0_#f0f]" data-text="SYS.SNAKE.EXE">
              SYS.SNAKE.EXE
            </h1>
            <p className="font-data text-[#f0f] text-sm mt-2 font-bold tracking-widest uppercase bg-[#0ff]/10 inline-block px-2 border border-[#0ff] border-opacity-30">
              STATUS: ONLINE // THREAD_COUNT: 0x4F
            </p>
          </div>
          <div className="flex gap-4">
            <div className="brutal-border bg-black p-2 min-w-[120px] text-center">
              <div className="text-[#f0f] font-data text-[10px] uppercase">MEM.ALLOC</div>
              <div className="text-3xl leading-none">{score}</div>
            </div>
            <div className="brutal-border-magenta bg-black p-2 min-w-[120px] text-center">
              <div className="text-[#0ff] font-data text-[10px] uppercase">PEAK.ALLOC</div>
              <div className="text-3xl leading-none">{highScore}</div>
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex flex-col lg:flex-row gap-10 items-start justify-center lg:justify-between w-full mx-auto">
          
          {/* Audio Module */}
          <div className="w-full lg:w-[400px] brutal-border bg-black flex flex-col order-2 lg:order-1">
            <div className="bg-[#f0f] text-black font-data text-xs p-1 font-bold text-center uppercase tracking-widest">
              AUDIO_SUBSYSTEM.DLL // PORT_03
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              <div className="h-6 flex items-end">
                {isPlaying && <div className="text-[#f0f] animate-pulse font-bold text-xl uppercase leading-none">{'>> SIGNAL DETECTED <<'}</div>}
              </div>
              
              <div className="border-[3px] border-[#0ff] p-4 relative shadow-[4px_4px_0_#f0f] bg-black">
                <div className="absolute -top-3 right-2 bg-black px-2 text-xs font-data text-[#f0f] border border-[#f0f]">CURRENT_STREAM</div>
                <div className="text-3xl text-white glitch-text truncate" data-text={currentTrack.title}>
                  {currentTrack.title}
                </div>
                <div className="text-[#0ff] font-data text-sm mt-2 font-bold">BY: {currentTrack.artist}</div>
              </div>

              <audio
                ref={audioRef}
                src={currentTrack.url}
                onEnded={handleTrackEnd}
                className="hidden"
              />

              {/* Controls */}
              <div className="flex gap-3 mt-2">
                <button onClick={skipBackward} className="flex-1 border-2 border-[#f0f] shadow-[3px_3px_0_#0ff] bg-black text-[#f0f] py-3 hover:bg-[#f0f] hover:text-black hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] font-bold uppercase transition-all font-data text-sm tracking-wider">
                  {"< PREV"}
                </button>
                <button onClick={togglePlay} className="flex-[2] border-2 border-[#0ff] bg-[#0ff] text-black shadow-[4px_4px_0_#f0f] py-3 hover:bg-white hover:border-white hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] font-bold uppercase transition-all font-data text-lg tracking-widest">
                  {isPlaying ? "HALT_EXEC()" : "RUN(PLAY)"}
                </button>
                <button onClick={skipForward} className="flex-1 border-2 border-[#f0f] shadow-[3px_3px_0_#0ff] bg-black text-[#f0f] py-3 hover:bg-[#f0f] hover:text-black hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] font-bold uppercase transition-all font-data text-sm tracking-wider">
                  {"NEXT >"}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-4 mt-2 border border-[#333] p-3 relative group overflow-hidden">
                <div className="absolute inset-0 bg-[#f0f] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                <button onClick={() => setIsMuted(!isMuted)} className="text-[#f0f] font-data tracking-widest uppercase text-xs w-[70px] text-left hover:text-white relative z-10">
                  {isMuted ? "VOL.00" : "VOL." + Math.round(volume * 100).toString().padStart(2, '0')}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="flex-grow appearance-none bg-transparent h-2 border border-[#0ff] cursor-pointer relative z-10"
                />
              </div>

              {/* Tracklist */}
              <div className="mt-2 border-t-2 border-dashed border-[#f0f] pt-4">
                <div className="text-[#0ff] text-sm font-data mb-3 font-bold tracking-widest">++ QUEUE ++</div>
                {TRACKS.map((track, i) => (
                  <div key={track.id} 
                    onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
                    className={`font-data text-sm p-3 mb-2 cursor-pointer border-2 ${i === currentTrackIndex ? 'border-[#0ff] bg-[#0ff] text-black font-bold shadow-[2px_2px_0_#f0f]' : 'border-transparent text-[#00cccc] hover:border-[#f0f] hover:text-[#f0f] hover:bg-[#220022]/40'} transition-all flex justify-between`}>
                    <span className="truncate pr-2">[{i}] {track.title}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Game Window */}
          <div className="flex-grow flex justify-center w-full lg:w-auto relative group order-1 lg:order-2">
            
            <SnakeGame onScoreChange={(newScore) => {
              setScore(newScore);
              if (newScore > highScore) setHighScore(newScore);
            }} />

            <div className="absolute -bottom-8 right-0 text-[#f0f] text-xs font-data">INPUT_PORT: WASD | SPACE</div>
          </div>

        </main>
      </div>
    </div>
  );
}

// --- SNAKE GAME COMPONENT ---

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const speed = Math.max(50, 120 - score * 2);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  const generateFood = useCallback((currentSnake: {x:number, y:number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      if (e.key === ' ') {
        if (!hasStarted) {
          setHasStarted(true);
        } else {
          setIsPaused((prev) => !prev);
        }
        return;
      }

      const { x, y } = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          setHasStarted(true);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          setHasStarted(true);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          setHasStarted(true);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          setHasStarted(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, hasStarted, speed, score, onScoreChange, generateFood]);

  return (
    <div className="relative border-4 border-[#0ff] bg-[#000] p-1 shadow-[8px_8px_0_#f0f] focus:outline-none" tabIndex={0}>
      <div 
        className="grid relative border border-[#222] bg-[#050505]"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(90vw, 500px)',
          height: 'min(90vw, 500px)',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const isFood = food.x === x && food.y === y;
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);

          return (
            <div
              key={i}
              className={`w-full h-full border-[1.5px] border-[#111] 
                ${isSnakeHead ? 'bg-[#fff] shadow-[0_0_15px_#0ff] z-10' : ''}
                ${isSnakeBody ? 'bg-[#0ff] opacity-80' : ''}
                ${isFood ? 'bg-[#f0f] animate-pulse relative z-0' : ''}
              `}
            >
              {isFood && <div className="absolute inset-[2px] bg-white opacity-40"></div>}
            </div>
          );
        })}
      </div>

      {(!hasStarted || gameOver || isPaused) && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-20 backdrop-blur-[2px] border-4 border-transparent">
          {!hasStarted && !gameOver && (
            <>
              <div className="text-[#0ff] font-system text-4xl mb-6 animate-pulse uppercase tracking-widest drop-shadow-[2px_2px_0_#f0f]">Awaiting Input...</div>
              <button 
                onClick={() => setHasStarted(true)}
                className="px-8 py-4 border-2 border-[#f0f] bg-black text-[#f0f] hover:bg-[#f0f] hover:text-black font-data uppercase tracking-widest font-bold transition-all shadow-[6px_6px_0_#0ff] active:translate-x-1 active:translate-y-1 active:shadow-none text-xl"
              >
                INITIALIZE
              </button>
            </>
          )}

          {isPaused && hasStarted && !gameOver && (
            <>
              <div className="text-white font-system text-6xl mb-4 glitch-text uppercase tracking-widest" data-text="INTERRUPT">INTERRUPT</div>
              <button 
                onClick={() => setIsPaused(false)}
                className="px-8 py-4 mt-6 border-2 border-[#0ff] bg-black text-[#0ff] hover:bg-[#0ff] hover:text-black font-data tracking-widest font-bold transition-all shadow-[6px_6px_0_#f0f] active:translate-x-1 active:translate-y-1 active:shadow-none text-xl"
              >
                RESUME_EXEC()
              </button>
            </>
          )}

          {gameOver && (
            <>
              <div className="text-[#f0f] font-system text-7xl mb-2 uppercase drop-shadow-[4px_4px_0_#0ff]">FATAL ERROR</div>
              <p className="text-white mb-8 font-data mt-4 border border-[#333] p-4 text-center">
                CORRUPTION DETECTED.
                <br/>
                FINAL YIELD: <span className="text-[#0ff] font-bold text-3xl ml-2">{score}</span>
              </p>
              <button 
                onClick={resetGame}
                className="px-8 py-4 border-2 border-white bg-black text-white hover:bg-white hover:text-black font-data uppercase tracking-widest font-bold transition-all shadow-[6px_6px_0_#f0f] active:translate-x-1 active:translate-y-1 active:shadow-none text-xl"
              >
                REBOOT SYSTEM
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
