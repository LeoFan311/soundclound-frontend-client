import AppFooter from '@/components/footer/app.footer';
import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/ultils/api';
import { Container } from '@mui/material';
import { useSearchParams } from 'next/navigation';

const DetailTrackPage = async (props: any) => {
   const { params } = props;
   console.log('DetailTrackPage props:  ', props);

   const resGetTrack = await sendRequest<IBackendRes<ITrackTop>>({
      url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
      method: 'GET',
   });

   const resGetComments = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
      url: `http://localhost:8000/api/v1/tracks/comments`,
      method: 'POST',
      queryParams: {
         current: 1,
         pageSize: 100,
         trackId: params.slug,
         sort: '-createdAt',
      },
   });

   console.log('Check resGetComments: ', resGetComments?.data?.result);

   return (
      <>
         <Container>
            <div>
               <WaveTrack
                  track={resGetTrack?.data ?? null}
                  comments={resGetComments?.data?.result ?? null}
               />
            </div>
         </Container>
         <AppFooter />
      </>
   );
};
export default DetailTrackPage;
