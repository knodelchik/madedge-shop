import Main from '../Components/Main';
import InfoSection from '../Components/InfoSection';
import CardsCarousel from '../Components/CardsCarousel';
import VideoSection from '../Components/VideoSection';
import ProductComparison from '../Components/ProductComparison';
import ReviewsSection from '../Components/ReviewsSection';

export default function Home() {
  return (
    <>
      <Main />
      <CardsCarousel />
      <InfoSection />
      <ProductComparison />
      <VideoSection />
      <ReviewsSection />
    </>
  );
}
