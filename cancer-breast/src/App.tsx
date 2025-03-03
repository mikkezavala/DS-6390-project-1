import {Route, Routes} from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import {Home} from "./pages/Home";
import {Team} from "./pages/Team";

export const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<Home/>}/>
                <Route path="/team" element={<Team/>}/>
            </Route>
        </Routes>
    );
};