import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../admin/dashboard";
import Portfolio from "../admin/portfolio";
import Settings from "../admin/settings";
import Testimonies from "../admin/testimonies";
//import Home from "../general/shop/index";


export default function ShopRoute() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        {/*<Route index element={<Home />} /> */}
        <Route path="portfolio" element={<Portfolio/>}></Route>
         <Route path="settings" element={<Settings/>}></Route>
         <Route path="testimonies" element={<Testimonies/>}></Route>
      </Route>
    </Routes>
  );
}
