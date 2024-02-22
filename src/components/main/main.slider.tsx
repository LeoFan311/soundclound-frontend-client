'use client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { Settings } from 'react-slick';
import '@/components/main/main.slider.scss';
import { Box, Divider } from '@mui/material';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface IProps {
   data: ITrackTop[];
   title: string;
}

const MainSlider = (props: IProps) => {
   const refSlide = useRef(null);
   const [slideWidth, setSlideWidth] = useState();

   const settings: Settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
   };

   const { data, title } = props;

   useEffect(() => {
      if (refSlide.current) {
         //@ts-ignore
         setSlideWidth(refSlide.current.getBoundingClientRect().width);
      }
   }, []);
   return (
      <Box
         sx={{
            marginTop: '35px',
            marginBottom: '13px',
            img: {
               width: '100%',
            },
            a: {
               textDecoration: 'none',
               textAlign: 'left',
            },
         }}
      >
         <div className="app-slider-container">
            <h2>{title}</h2>
            <Slider {...settings}>
               {data.map((track) => {
                  return (
                     <div className="slider-item" key={track._id}>
                        <div className="slider-cart" ref={refSlide}>
                           <div
                              style={{
                                 width: slideWidth ? slideWidth : '100%',
                                 height: slideWidth ? slideWidth : '214px',
                                 background: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl})`,
                                 backgroundPosition: 'center',
                                 backgroundSize: 'cover',
                                 backgroundRepeat: 'no-repeat',
                              }}
                           />
                           <Link
                              href={`track/${track._id}?audio=${track.trackUrl}&id=${track._id}`}
                           >
                              <div
                                 className="track-title"
                                 style={{
                                    marginTop: '5px',
                                    textAlign: 'left',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: '#333',
                                 }}
                              >
                                 {track.title}
                              </div>
                           </Link>

                           <div
                              className="track-description"
                              style={{
                                 overflow: 'hidden',
                                 textOverflow: 'ellipsis',
                                 whiteSpace: 'nowrap',
                                 color: '#999',
                                 fontSize: '14px',
                              }}
                           >
                              {track.description}
                           </div>
                        </div>
                     </div>
                  );
               })}
            </Slider>
         </div>
      </Box>
   );
};

export default MainSlider;
