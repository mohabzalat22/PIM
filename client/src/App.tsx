import MainLayout from "./layout/MainLayout";
import { Routes, Route } from "react-router-dom";
import Store from "./pages/Store";
import StoreView from "./pages/StoreView";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Attribute from "./pages/Attribute";
import Asset from "./pages/Asset";
import Dashboard from "./pages/Dashboard";
import ProductAttributes from "./pages/ProductAttributes";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout></MainLayout>}>
          <Route path="/" element={<Dashboard></Dashboard>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/stores" element={<Store></Store>}></Route>
          <Route path="/store-views" element={<StoreView></StoreView>}></Route>
          <Route path="/products" element={<Product></Product>}></Route>
          <Route path="/products/:id" element={<ProductDetail></ProductDetail>}></Route>
          <Route path="/categories" element={<Category></Category>}></Route>
          <Route path="/attributes" element={<Attribute></Attribute>}></Route>
          <Route path="/assets" element={<Asset></Asset>}></Route>
          <Route path="/product-attributes" element={<ProductAttributes></ProductAttributes>}></Route>
          <Route path="/settings" element={<Settings></Settings>}></Route>
          {/* fallback route */}
          <Route path="*" element={<NotFound></NotFound>}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
