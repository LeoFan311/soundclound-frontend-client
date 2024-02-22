import AppFooter from '@/components/footer/app.footer';
import AppHeader from '@/components/header/app.header';

//{ children }: { children: React.ReactNode }
export default function RootLayout(props: any) {
   const { children } = props;
   return (
      <html lang="en">
         <body>
            <>
               <AppHeader />
               {children}
            </>
         </body>
      </html>
   );
}
