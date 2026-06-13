import React from "react";
import { Navbar } from '../../components/Navbar';
import { Navbar2 } from "./components/Navbar2";
import { Header145 } from "./components/Header145";
import { Layout394 } from "./components/Layout394";
import { Testimonial42 } from "./components/Testimonial42";
import { Layout369 } from "./components/Layout369";
import { Gallery10 } from "./components/Gallery10";
import { Contact28 } from "./components/Contact28";
import { BookingVideo } from "./components/BookingVideo";
import { Footer3 } from "./components/Footer3";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Header145 />
      <Layout394 />
      <Testimonial42 />
      <Layout369 />
      <Gallery10 />
      <Contact28 />
      <BookingVideo />
      <Footer3 />
    </div>
  );
}
