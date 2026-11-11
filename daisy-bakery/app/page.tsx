"use client";

import HeaderDaisy from "@/components/templates/bekary-shop-landing-page-daisy/Header Daisy";
import ProductsShowcaseDaisy from "@/components/templates/bekary-shop-landing-page-daisy/Products Showcase Daisy";
import OfferDaisy from "@/components/templates/bekary-shop-landing-page-daisy/Offer Daisy";
import TestimonialDaisy from "@/components/templates/bekary-shop-landing-page-daisy/Testimonial Daisy";
import FooterDaisy from "@/components/templates/bekary-shop-landing-page-daisy/Footer Daisy";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeaderDaisy />
      <ProductsShowcaseDaisy />
      <OfferDaisy />
      <TestimonialDaisy />
      <FooterDaisy />
    </main>
  );
}
