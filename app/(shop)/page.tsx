import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import NewDrop from "@/components/home/NewDrop";
import Lookbook from "@/components/home/Lookbook";
import BrandStory from "@/components/home/BrandStory";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <NewDrop />
      <Lookbook />
      <BrandStory />
      <Newsletter />
    </>
  );
}
