import MainLayout from "./layout/MainLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Store from "./pages/Store";
import StoreView from "./pages/StoreView";
import Product from "./pages/Product";
import AttributeSetPage from "./pages/AttributeSet";
import AttributeGroupPage from "./pages/AttributeGroup";
import Category from "./pages/Category";
import Attribute from "./pages/Attribute";
import Asset from "./pages/Asset";
import Dashboard from "./pages/Dashboard";
import ProductAttributes from "./pages/ProductAttributes";
import ProductDetail from "./pages/ProductDetail";
import ProductKanban from "./pages/ProductKanban";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import LocalePage from "./pages/Locale";
import Home from "./pages/Home";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TeamPage from "./pages/Team";
import TeamMemberPage from "./pages/TeamMember";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Success from "./pages/payment/Success";
import Cancel from "./pages/payment/Cancel";
import { Subscriptions } from "./pages/payment/Subscriptions";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/subscriptions" element={<Subscriptions />} />

        <Route
          element={
            <>
              <SignedIn>
                <MainLayout></MainLayout>
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        >
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/stores" element={<Store></Store>}></Route>
          <Route path="/store-views" element={<StoreView></StoreView>}></Route>
          <Route path="/locales" element={<LocalePage></LocalePage>}></Route>
          <Route path="/products" element={<Product></Product>}></Route>
          <Route
            path="/products/:id"
            element={<ProductDetail></ProductDetail>}
          ></Route>
          <Route
            path="/product-workflow"
            element={<ProductKanban></ProductKanban>}
          ></Route>
          <Route path="/categories" element={<Category></Category>}></Route>
          <Route path="/attributes" element={<Attribute></Attribute>}></Route>
          <Route
            path="/attribute-sets"
            element={<AttributeSetPage></AttributeSetPage>}
          ></Route>
          <Route
            path="/attribute-groups"
            element={<AttributeGroupPage></AttributeGroupPage>}
          ></Route>
          <Route path="/assets" element={<Asset></Asset>}></Route>
          <Route
            path="/product-attributes"
            element={<ProductAttributes></ProductAttributes>}
          ></Route>
          <Route path="/teams" element={<TeamPage></TeamPage>}></Route>
          <Route
            path="/team-members"
            element={<TeamMemberPage></TeamMemberPage>}
          ></Route>
          <Route path="/settings" element={<Settings></Settings>}></Route>
        </Route>

        {/* fallback route */}
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </>
  );
}

export default App;
