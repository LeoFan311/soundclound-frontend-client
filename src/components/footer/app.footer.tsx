'use client';
import { TrackContext, useTrackContext } from '@/lib/track.wrapper';
import './app.footer.scss';
import { useHasMounted } from '@/ultils/customHook';
import { AppBar, Box, Container } from '@mui/material';
import { use, useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {
   const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
   const playerRef = useRef(null);
   const hasMounted = useHasMounted();
   if (!hasMounted) return <></>;
   //@ts-ignore
   if (currentTrack?.isPlaying) {
      //@ts-ignore
      playerRef?.current?.audio?.current?.play();
   } else {
      //@ts-ignore
      playerRef?.current?.audio?.current?.pause();
   }
   return (
      <Box>
         <AppBar
            position="fixed"
            color="primary"
            sx={{
               top: 'auto',
               bottom: 0,
               backgroundColor: '#f2f2f2',
               borderTop: '1px solid #cecece',
               marginTop: '300spx',
               '.rhap_container': {
                  padding: '3px 15px',
               },
            }}
         >
            <Container
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '5px',
                  paddingBottom: '5px',
               }}
            >
               <AudioPlayer
                  className="app-footer-audioPlayer"
                  ref={playerRef}
                  style={{
                     backgroundColor: '#f2f2f2',
                     boxShadow: 'none',
                     width: '80%',
                     marginLeft: '-14px',
                     marginRight: '50px',
                  }}
                  autoPlay
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                  onPlay={() =>
                     setCurrentTrack({
                        ...currentTrack,
                        isPlaying: true,
                     })
                  }
                  onPause={() => {
                     setCurrentTrack({
                        ...currentTrack,
                        isPlaying: false,
                     });
                  }}
                  volume={0.5}
                  // other props here
               />

               <div
                  style={{
                     color: '#666',
                     width: '20%',
                     overflow: 'hidden',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'start',
                  }}
               >
                  <div
                     style={{
                        fontSize: '16px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                     }}
                  >
                     {currentTrack?.title}
                  </div>
                  <div
                     style={{
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                     }}
                  >
                     {currentTrack?.description}
                  </div>
               </div>
            </Container>
         </AppBar>
      </Box>
   );
};

export default AppFooter;
