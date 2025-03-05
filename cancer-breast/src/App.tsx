import {Route, Routes} from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import {Home} from "./pages/Home";
import {Team} from "./pages/Team";
import {DataSet} from "./pages/DataSet";
import {Loading} from "./components/Loading";
import {Suspense} from "react";

export const App = () => {
    return (
        <Suspense fallback={<Loading/>}>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/dataset" element={<DataSet/>}/>
                    <Route path="/team" element={<Team/>}/>
                </Route>

            </Routes>
        </Suspense>
    );
};
