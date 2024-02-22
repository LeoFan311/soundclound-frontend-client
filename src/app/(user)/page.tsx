import MainSlider from '@/components/main/main.slider';
import { Container, Divider } from '@mui/material';
import { sendRequest } from '@/ultils/api';

export default async function HomePage() {
   const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: 'http://localhost:8000/api/v1/tracks/top',
      method: 'POST',
      body: {
         category: 'CHILL',
         limit: 10,
      },
   });

   const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: 'http://localhost:8000/api/v1/tracks/top',
      method: 'POST',
      body: {
         category: 'WORKOUT',
         limit: 10,
      },
   });

   const party = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: 'http://localhost:8000/api/v1/tracks/top',
      method: 'POST',
      body: {
         category: 'PARTY',
         limit: 10,
      },
   });

   return (
      <Container>
         <MainSlider data={chills?.data ?? []} title={'Top Chill'} />
         <Divider />
         <MainSlider data={workouts?.data ?? []} title={'Top Workout'} />
         <Divider />
         <MainSlider data={party?.data ?? []} title={'Top Party'} />
      </Container>
   );
}

// const res = await fetch('http://localhost:8000/api/v1/tracks/top', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     category: 'CHILL',
//     limit: 10,
//   }),
// });
