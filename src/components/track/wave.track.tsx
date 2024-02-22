'use client';
import './wave.scss';
import { useWaveSurfer } from '@/ultils/customHook';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTrackContext } from '@/lib/track.wrapper';
import { Tooltip } from '@mui/material';

interface IProps {
   track: ITrackTop | null;
   comments: ITrackComment[] | null;
}
const WaveTrack = (Props: IProps) => {
   const { track } = Props;
   const { comments } = Props;
   console.log('Check comments: ', comments);
   const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

   const containerRef = useRef<HTMLDivElement>(null);
   const timeRef = useRef<HTMLDivElement>(null);
   const durationRef = useRef<HTMLDivElement>(null);
   const hoverRef = useRef<HTMLDivElement>(null);

   const arrComments = [
      {
         id: 1,
         avatar: 'http://localhost:8000/images/chill1.png',
         moment: 10,
         user: 'username 1',
         content: 'just a comment1',
      },
      {
         id: 2,
         avatar: 'http://localhost:8000/images/chill1.png',
         moment: 30,
         user: 'username 2',
         content: 'just a comment3',
      },
      {
         id: 3,
         avatar: 'http://localhost:8000/images/chill1.png',
         moment: 50,
         user: 'username 3',
         content: 'just a comment3',
      },
   ];

   const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
      let gradient;
      let progressGradient;
      if (typeof window !== 'undefined') {
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d')!;

         // Define the waveform gradient
         gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
         gradient.addColorStop(0, '#656666'); // Top color
         gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666'); // Top color
         gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
         gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
         gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1'); // Bottom color
         gradient.addColorStop(1, '#B1B1B1'); // Bottom color

         // Define the progress gradient
         progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
         progressGradient.addColorStop(0, '#EE772F'); // Top color
         progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926'); // Top color
         progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
         progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
         progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094'); // Bottom color
         progressGradient.addColorStop(1, '#F6B094'); // Bottom color
      }

      return {
         waveColor: gradient,
         progressColor: progressGradient,
         barWidth: 3,
         height: 100,
         url: `/api?audio=${track?.trackUrl}`,
      };
   }, []);

   const waveSurfer = useWaveSurfer(containerRef, optionsMemo);

   const onPlayClick = useCallback(() => {
      if (waveSurfer) {
         waveSurfer.isPlaying() ? waveSurfer.pause() : waveSurfer.play();
      }
   }, [waveSurfer]);

   const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secondsRemainder = Math.round(seconds) % 60;
      const paddedSeconds = `0${secondsRemainder}`.slice(-2);
      return `${minutes}:${paddedSeconds}`;
   };

   useEffect(() => {
      if (waveSurfer) {
         if (currentTrack.isPlaying) {
            waveSurfer.play();
         } else {
            waveSurfer.pause();
         }
      }
   }, [currentTrack.isPlaying]);

   useEffect(() => {
      if (!waveSurfer) return;
      const timeEl = timeRef.current!;
      const durationEl = durationRef.current!;
      const hover = hoverRef.current!;
      const waveFrom = containerRef.current!;
      waveFrom.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`));

      const subscriptions = [
         waveSurfer.on('play', () => {
            //@ts-ignore
            setCurrentTrack((prev) => {
               return {
                  ...track,
                  isPlaying: true,
               };
            });
         }),
         waveSurfer.on('pause', () => {
            //@ts-ignore
            setCurrentTrack((prev) => {
               return {
                  ...prev,
                  isPlaying: false,
               };
            });
         }),
         waveSurfer.on('decode', (duration) => (durationEl.textContent = formatTime(duration))),
         waveSurfer.on(
            'timeupdate',
            (currentTime) => (timeEl.textContent = formatTime(currentTime)),
         ),

         // play khi có sự kiện interaction
         waveSurfer.once('interaction', () => {
            waveSurfer.play();
         }),
      ];

      return () => {
         subscriptions.forEach((unsub) => unsub());
      };
   }, [waveSurfer]);

   const countLeft = (moment: number) => {
      const hardCodeDuration = 199;
      const percent = (moment / hardCodeDuration) * 100;
      return `${percent}%`;
   };

   return (
      <div style={{ marginTop: 20 }}>
         <div
            style={{
               display: 'flex',
               gap: '20',
               padding: 20,
               background: 'linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)',
            }}
         >
            <div
               style={{
                  width: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
               }}
            >
               <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                     onClick={() => {
                        onPlayClick();
                     }}
                     style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        background: '#f50',
                        height: '50px',
                        width: '50px',
                        cursor: 'pointer',
                     }}
                  >
                     {currentTrack?.isPlaying === true ? (
                        <PauseIcon sx={{ fontSize: 30, color: 'white' }} />
                     ) : (
                        <PlayArrowIcon sx={{ fontSize: 30, color: 'white' }} />
                     )}
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                     <div>
                        <span
                           style={{
                              backgroundColor: 'rgba(0,0,0,.8)',
                              color: '#fff',
                              paddingLeft: '10px',
                              paddingRight: '10px',
                              fontWeight: 200,
                              fontSize: '24px',
                           }}
                        >
                           {track?.title}
                        </span>
                     </div>
                     <div style={{}}>
                        <span
                           style={{
                              backgroundColor: 'rgba(0,0,0,.8)',
                              color: '#fff',
                              paddingLeft: '10px',
                              paddingRight: '10px',
                              paddingTop: '3px',
                              paddingBottom: '3px',
                              fontWeight: 200,
                              fontSize: '16px',
                           }}
                        >
                           {track?.description}
                        </span>
                     </div>
                  </div>
               </div>
               <div ref={containerRef} className="wave-form-container">
                  <div ref={timeRef} className="time" id="time">
                     0:00
                  </div>
                  <div ref={durationRef} className="duration" id="duration">
                     0:00
                  </div>
                  <div ref={hoverRef} className="hover-wave" id="hover"></div>
                  <div
                     className="overlay"
                     style={{
                        position: 'absolute',
                        height: '30%',
                        width: '100%',
                        bottom: '0',
                        backdropFilter: 'brightness(0.5)',
                     }}
                  ></div>

                  {comments &&
                     comments.map((item) => {
                        return (
                           <Tooltip key={item._id} title={item.content} arrow>
                              <img
                                 onPointerMove={(e) => {
                                    const hover = hoverRef.current!;
                                    hover.style.width = countLeft(item.moment);
                                 }}
                                 style={{
                                    height: 20,
                                    width: 20,
                                    position: 'absolute',
                                    bottom: 9,
                                    left: countLeft(item.moment),
                                    zIndex: 20,
                                    borderRadius: '50%',
                                 }}
                                 src={`http://localhost:8000/images/chill1.png`}
                              />
                           </Tooltip>
                        );
                     })}
               </div>
            </div>
            <div
               style={{
                  padding: '0px 0px 0px 30px',
               }}
            >
               <div
                  style={{
                     width: 320,
                     height: 320,
                     background: '#ccc',
                     backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl})`,
                     backgroundPosition: 'center',
                     backgroundSize: 'cover',
                     backgroundRepeat: 'no-repeat',
                  }}
               ></div>
            </div>
         </div>
      </div>
   );
};

export default WaveTrack;
