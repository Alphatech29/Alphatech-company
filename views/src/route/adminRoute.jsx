import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../admin/dashboard";
import Portfolio from "../admin/portfolio";
import Settings from "../admin/settings";
import Testimonies from "../admin/testimonies";
import Faqs from "../admin/faqs";
import NotFound from "../admin/notFound";
import ContactDashboard from "../admin/contact";
import CreateContact from "../admin/createContact";
import Profile from "../admin/profile";
import CreatePage from "../admin/createPage";
import Page from "../admin/page";
import EditPage from "../admin/editPage";
//import Home from "../general/shop/index";


export default function AdminRoute() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        {/*<Route index element={<Home />} /> */}
        <Route path="portfolio" element={<Portfolio/>}></Route>
         <Route path="settings" element={<Settings/>}></Route>
         <Route path="testimonies" element={<Testimonies/>}></Route>
         <Route path="faqs" element={<Faqs/>}></Route>
         <Route path="message" element={<ContactDashboard/>}></Route>
         <Route path="message/create" element={<CreateContact/>}></Route>
         <Route path="profile" element={<Profile/>}></Route>
         <Route path="page/create" element={<CreatePage/>}></Route>
         <Route path="page/edit/:id" element={<EditPage/>}></Route>
         <Route path="page" element={<Page/>}></Route>
         <Route path="*" element={<NotFound/>}></Route>
      </Route>
    </Routes>
  );
}
