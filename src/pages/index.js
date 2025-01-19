import { Inter } from 'next/font/google'
import { Overlay } from '@/components/overlay';
import MyCanvas from '@/components/canvas';
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
 

export default function Home() {
  return (
    <div
      className={`${inter.className} size-full`}
    >
      <>
        <MyCanvas />
        <Overlay />
       </>
    </div>
  );
}
