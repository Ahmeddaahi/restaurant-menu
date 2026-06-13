import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import ReviewSection from "@/components/ReviewSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getMenuData } from "@/lib/menu";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { items } = getMenuData();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <MenuSection items={items} />
        <AboutSection />
        <ReviewSection />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
