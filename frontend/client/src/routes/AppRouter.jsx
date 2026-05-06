import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import FlowerDetail from "../pages/FlowerDetail";
import FlowerList from "../pages/FlowerList";
import HouseDetail from "../pages/HouseDetail";
import RoomStats from "../pages/RoomStats";
import Flowers from "../pages/Flowers";
import Houses from "../pages/Houses";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Houses />} />
                <Route path="/houses" element={<Houses />} />
                <Route path="/flowerList" element={<FlowerList />} />
                <Route path="/houseDetail" element={<HouseDetail />} />
                <Route path="/roomStats" element={<RoomStats />} />

                {/* Back-compat */}
                <Route path="/flowers" element={<FlowerList />} />
                <Route path="/house" element={<HouseDetail />} />
                <Route path="/flowers/:id" element={<FlowerDetail />} />
                <Route path="/old-flowers" element={<Flowers />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;