import Banner from "../components/Banner";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-10">
      <Banner />
      <LatestCollection />
      <div className="mt-32 mb-32">
        <OurPolicy />
      </div>
      
    </div>
  );
}
