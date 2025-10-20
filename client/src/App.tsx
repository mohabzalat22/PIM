import MainLayout from "./layout/MainLayout";
import { Routes, Route } from "react-router-dom";
import Store from "./pages/Store";
import Home from "./pages/Home";
import StoreView from "./pages/StoreView";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Attribute from "./pages/Attribute";
import Asset from "./pages/Asset";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout></MainLayout>}>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/stores" element={<Store></Store>}></Route>
          <Route path="/store-views" element={<StoreView></StoreView>}></Route>
          <Route path="/products" element={<Product></Product>}></Route>
          <Route path="/categories" element={<Category></Category>}></Route>
          <Route path="/attributes" element={<Attribute></Attribute>}></Route>
          <Route path="/assets" element={<Asset></Asset>}></Route>
          {/* fallback route */}
          <Route path="*" element={<NotFound></NotFound>}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
