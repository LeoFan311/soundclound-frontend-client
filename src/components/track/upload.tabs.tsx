'use client';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Step1 from './steps/step1';
import Step2 from './steps/step2';

interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
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

//====== Dùng cho việc SEO ======//
// function a11yProps(index: number) {
//    return {
//       id: `simple-tab-${index}`,
//       'aria-controls': `simple-tabpanel-${index}`,
//    };
// }

const UploadTabs = () => {
   const [value, setValue] = useState(0);
   const [trackUpload, setTrackUpload] = useState({
      fileName: '',
      percent: 0,
      uploadedTrackName: '',
   });

   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
   };

   return (
      <Box sx={{ width: '100%', mt: 5, border: '1px solid #ccc', marginBottom: '100px' }}>
         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
               <Tab label="Track" disabled={value !== 0} />
               <Tab label="Basic information" disabled={value !== 1} />
            </Tabs>
         </Box>
         <CustomTabPanel value={value} index={0}>
            <Step1 setValue={setValue} setTrackUpload={setTrackUpload} trackUpload={trackUpload} />
         </CustomTabPanel>
         <CustomTabPanel value={value} index={1}>
            <Step2 trackUpload={trackUpload} setTrackUpload={setTrackUpload} setValue={setValue} />
         </CustomTabPanel>
         <ToastContainer
            position="top-center"
            autoClose={6000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            // closeButton
         />
      </Box>
   );
};

export default UploadTabs;
