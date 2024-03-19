
import MainLayout from "./pages/Layout/wrapper";

// Components


const APP_ROUTES = [
  {
    path: "/",
    element: <MainLayout />, // Landing Page
    // children: [
    //   {
    //     path: "isPal",
    //     element: <IsPal/>
    //   }
    // ],
  },
];

export default APP_ROUTES;