import UploadTabs from '@/components/track/upload.tabs';
import { Container } from '@mui/material';

const UploadPage = () => {
   return (
      <Container sx={{ minWidth: '100vh' }}>
         <UploadTabs />
      </Container>
   );
};

export default UploadPage;
