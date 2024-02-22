'use client';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './theme.css';
import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { sendRequestFile } from '@/ultils/api';
import axios from 'axios';

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

function InputFileUpload() {
   return (
      <Button
         component="label"
         variant="contained"
         startIcon={<CloudUploadIcon />}
         onClick={(event) => event.preventDefault()}
      >
         Upload file
         <VisuallyHiddenInput type="file" />
      </Button>
   );
}

interface IProps {
   setValue: (v: number) => void;
   setTrackUpload: any;
   trackUpload: any;
}

const Step1 = (props: IProps) => {
   // const [percent, setPercent] = useState(0);
   const { data: session } = useSession();
   const { trackUpload } = props;

   const onDrop = useCallback(
      async (acceptedFiles: FileWithPath[]) => {
         if (acceptedFiles && acceptedFiles[0]) {
            props.setValue(1);
            const audio = acceptedFiles[0];
            const formData = new FormData();
            formData.append('fileUpload', audio);
            try {
               const res = await axios.post('http://localhost:8000/api/v1/files/upload', formData, {
                  headers: {
                     Authorization: `Bearer ${session?.access_token}`,
                     target_type: 'tracks',
                  },
                  onUploadProgress: (progressEvent) => {
                     let percentCompleted = Math.floor(
                        (progressEvent.loaded * 100) / progressEvent.total!,
                     );
                     props.setTrackUpload({
                        ...trackUpload,
                        fileName: audio.name,
                        percent: percentCompleted,
                     });
                  },
               });
               props.setTrackUpload((prev: any) => ({
                  ...prev,
                  uploadedTrackName: res.data.data.fileName,
               }));
               // console.log('check Step1 res: ', res.data.data.fileName);
            } catch (error) {
               //@ts-ignore
               alert(error?.response?.data?.message);
            }
         }
      },
      [session],
   );

   const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: {
         'audio/mpeg': ['.mp3'],
         'audio/wav': ['.wav'],
         'audio/webm': ['.webm'],
         'audio/flac': ['.flac'],
         'audio/x-m4a': ['.m4a'],
      },
   });

   const files = acceptedFiles.map((file: FileWithPath) => (
      <li key={file.path}>
         {file.path} - {file.size} bytes
      </li>
   ));

   return (
      <section className="container">
         <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <InputFileUpload />
            <p>Drag 'n' drop some files here, or click to select files</p>
         </div>
         <aside>
            <ul>{files}</ul>
         </aside>
      </section>
   );
};

export default Step1;
