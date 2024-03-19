
import MainLayout from "./pages/layout/Wrapper";

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