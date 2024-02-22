'use client';
import { Container } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/ultils/api';
import { toast } from 'react-toastify';

interface IProps {
   trackUpload: {
      fileName: string;
      percent: number;
      uploadedTrackName: string;
   };
   setTrackUpload: any;
   setValue: (v: number) => void;
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
   return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
         <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" {...props} />
         </Box>
         <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
               props.value,
            )}%`}</Typography>
         </Box>
      </Box>
   );
}

function LinearWithValueLabel(props: any) {
   return (
      <Box sx={{ width: '100%' }}>
         <LinearProgressWithLabel value={props.trackUpload.percent} />
      </Box>
   );
}
interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}

const VisuallyHiddenInput = styled('input')({
   clip: 'rect(0 0 0 0)',
   clipPath: 'inset(50%)',
   height: 1,
   overflow: 'hidden',
   position: 'absolute',
   bottom: 0,
   left: 0,
   whiteSpace: 'nowrap',
   width: 1,
});

function InputFileUpload(props: any) {
   const { data: session } = useSession();
   const { info, setInfo } = props;
   const handleUpload = async (image: any) => {
      const formData = new FormData();
      formData.append('fileUpload', image);
      try {
         const res = await axios.post('http://localhost:8000/api/v1/files/upload', formData, {
            headers: {
               Authorization: `Bearer ${session?.access_token}`,
               target_type: 'images',
            },
         });

         setInfo({
            ...info,
            imgUrl: res.data.data.fileName,
         });
      } catch (error) {
         //@ts-ignore
         alert(error?.response?.data?.message);
      }
   };

   return (
      <Button
         onChange={(e) => {
            const event = e.target as HTMLInputElement;
            if (event.files) {
               handleUpload(event.files[0]);
            }
         }}
         component="label"
         variant="contained"
         startIcon={<CloudUploadIcon />}
      >
         Upload file
         <VisuallyHiddenInput type="file" />
      </Button>
   );
}

function CustomTabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
         {...other}
      >
         {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
   );
}

//======= Tối ưu SEO =======//
// function a11yProps(index: number) {
//    return {
//       id: `simple-tab-${index}`,
//       'aria-controls': `simple-tabpanel-${index}`,
//    };
// }

interface INewTrack {
   title: string;
   description: string;
   trackUrl: string;
   imgUrl: string;
   category: string;
}

const category = [
   {
      value: 'CHILL',
      label: 'CHILL',
   },
   {
      value: 'WORKOUT',
      label: 'WORKOUT',
   },
   {
      value: 'PARTY',
      label: 'PARTY',
   },
];

const Step2 = (props: IProps) => {
   const [value, setValue] = React.useState(0);
   const [info, setInfo] = React.useState<INewTrack>({
      title: '',
      description: '',
      trackUrl: '',
      imgUrl: '',
      category: '',
   });

   const { trackUpload, setTrackUpload } = props;
   const { data: session } = useSession();
   React.useEffect(() => {
      if (trackUpload && trackUpload.uploadedTrackName) {
         setInfo({
            ...info,
            trackUrl: trackUpload.uploadedTrackName,
         });
      }
   }, [trackUpload]);

   const handleSubmitForm = async () => {
      console.log('>>> Check info full: ', info);

      const res = await sendRequest<IBackendRes<ITrackTop[]>>({
         url: 'http://localhost:8000/api/v1/tracks',
         method: 'POST',
         headers: {
            Authorization: `Bearer ${session?.access_token}`,
         },
         body: {
            title: info.title,
            description: info.description,
            trackUrl: info.trackUrl,
            imgUrl: info.imgUrl,
            category: info.category,
         },
      });
      if (res && res.data) {
         toast.success('Create success!'); // thông báo thành công
         setInfo({
            title: '',
            description: '',
            trackUrl: '',
            imgUrl: '',
            category: '',
         });
         setTrackUpload({
            fileName: '',
            percent: 0,
            uploadedTrackName: '',
         });
         props.setValue(0);
      } else {
         toast.error(res.message);
      }
   };

   return (
      <Box>
         <Box sx={{ width: '100%' }}>
            <CustomTabPanel value={0} index={0}>
               <div>
                  <div>{trackUpload.fileName}</div>
                  <LinearWithValueLabel trackUpload={trackUpload} />
               </div>

               <Grid container spacing={2} mt={5}>
                  <Grid
                     item
                     xs={6}
                     md={4}
                     sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: '10px',
                     }}
                  >
                     <div
                        style={{
                           height: 250,
                           width: 250,
                           background: '#ccc',
                           backgroundImage: info?.imgUrl
                              ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl})`
                              : '',
                           backgroundSize: 'cover',
                           backgroundPosition: 'center',
                           backgroundRepeat: 'no-repeat',
                        }}
                     >
                        {/* <div>
                           {info.imgUrl && (
                              <img
                                 src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                              />
                           )}
                        </div> */}
                     </div>
                     <div>
                        <InputFileUpload setInfo={setInfo} info={info} />
                     </div>
                  </Grid>
                  <Grid item xs={6} md={8}>
                     <TextField
                        value={info?.title}
                        onChange={(e) =>
                           setInfo({
                              ...info,
                              title: e.target.value,
                           })
                        }
                        label="Title"
                        variant="standard"
                        fullWidth
                        margin="dense"
                     />
                     <TextField
                        value={info?.description}
                        onChange={(e) =>
                           setInfo({
                              ...info,
                              description: e.target.value,
                           })
                        }
                        label="Description"
                        variant="standard"
                        fullWidth
                        margin="dense"
                     />
                     <TextField
                        value={info?.category}
                        onChange={(e) =>
                           setInfo({
                              ...info,
                              category: e.target.value,
                           })
                        }
                        sx={{
                           mt: 3,
                        }}
                        id="outlined-select-currency"
                        select
                        label="Category"
                        fullWidth
                        variant="standard"
                        //   defaultValue="EUR"
                     >
                        {category.map((option) => (
                           <MenuItem key={option.value} value={option.value}>
                              {option.label}
                           </MenuItem>
                        ))}
                     </TextField>
                     <Button
                        variant="outlined"
                        sx={{
                           mt: 5,
                        }}
                        onClick={() => handleSubmitForm()}
                     >
                        Save
                     </Button>
                  </Grid>
               </Grid>
            </CustomTabPanel>
         </Box>
      </Box>
   );
};

export default Step2;
