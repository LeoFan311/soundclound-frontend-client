'use client';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Container, Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { TrackContext, useTrackContext } from '@/lib/track.wrapper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ProfilePageContent = ({ data }: { data: ITrackTop[] }) => {
   const router = useRouter();
   const [tracksData, setTracksData] = useState<ITrackTop[] | null>(null);
   useEffect(() => {
      setTracksData(data);
   }, [data]);
   const theme = useTheme();
   const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

   return (
      <Grid
         sx={{
            marginLeft: '-50px',
            marginRight: '-50px',
         }}
      >
         <Grid container>
            {tracksData &&
               tracksData.map((item, index) => {
                  return (
                     <Grid
                        item={true}
                        md={6}
                        sx={{
                           mb: '50px',
                           pl: '50px',
                           pr: '50px',
                        }}
                        key={item._id}
                     >
                        <Card
                           sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                           }}
                        >
                           <Box
                              sx={{ display: 'flex', flexDirection: 'column' }}
                           >
                              <CardContent sx={{ flex: '1 0 auto' }}>
                                 <Typography
                                    sx={{
                                       cursor: 'pointer',
                                    }}
                                    component="div"
                                    variant="h5"
                                    onClick={() => {
                                       window.location.href = `http://localhost:3000/track/${item._id}?audio=${item.trackUrl}&id=${item._id}`;
                                    }}
                                 >
                                    {item.title}
                                 </Typography>
                                 <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                 >
                                    {item.category}
                                 </Typography>
                              </CardContent>
                              <Box
                                 sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    pl: 1,
                                    pb: 1,
                                 }}
                              >
                                 <IconButton aria-label="previous">
                                    {theme.direction === 'rtl' ? (
                                       <SkipNextIcon />
                                    ) : (
                                       <SkipPreviousIcon />
                                    )}
                                 </IconButton>
                                 {(item._id !== currentTrack._id ||
                                    (item._id === currentTrack._id &&
                                       currentTrack.isPlaying === false)) && (
                                    <IconButton
                                       aria-label="play/pause"
                                       onClick={() =>
                                          setCurrentTrack({
                                             ...item,
                                             isPlaying: true,
                                          })
                                       }
                                    >
                                       <PlayArrowIcon
                                          sx={{ height: 38, width: 38 }}
                                       />
                                    </IconButton>
                                 )}
                                 {item._id === currentTrack._id &&
                                    currentTrack.isPlaying === true && (
                                       <IconButton
                                          aria-label="play/pause"
                                          onClick={() =>
                                             setCurrentTrack({
                                                ...item,
                                                isPlaying: false,
                                             })
                                          }
                                       >
                                          <PauseIcon
                                             sx={{ height: 38, width: 38 }}
                                          />
                                       </IconButton>
                                    )}

                                 <IconButton aria-label="next">
                                    {theme.direction === 'rtl' ? (
                                       <SkipPreviousIcon />
                                    ) : (
                                       <SkipNextIcon />
                                    )}
                                 </IconButton>
                              </Box>
                           </Box>
                           <CardMedia
                              component="img"
                              sx={{ width: 151 }}
                              image={`http://localhost:8000/images/${item.imgUrl}`}
                              alt="Live from space album cover"
                           />
                        </Card>
                     </Grid>
                  );
               })}
         </Grid>
      </Grid>
   );
};

export default ProfilePageContent;
