import Image from 'next/image';
import Main from './Components/Main';
import InfoSection from './Components/InfoSection';
import CardsCarousel from './Components/CardsCarousel';
import VideoSection from './Components/VideoSection';
import Footer from './Components/Footer';
import ProductComparison from './Components/ProductComparison';

export default function Home() {
  return (
    <>
      <Main />
      <CardsCarousel />
      <InfoSection />
      <ProductComparison />
      <VideoSection />
    </>
  );
}
