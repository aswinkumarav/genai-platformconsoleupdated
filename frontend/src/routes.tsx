
import Layout from "./pages/Layout/index";

// Components


const APP_ROUTES = [
  {
    path: "/",
    element: <Layout />, // Landing Page
    // children: [
    //   {
    //     path: "isPal",
    //     element: <IsPal/>
    //   }
    // ],
  },
];

export default APP_ROUTES;