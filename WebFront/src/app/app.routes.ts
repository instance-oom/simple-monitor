import { Routes, RouterModule } from '@angular/router';

import { PagesRoutes } from "./pages/pages.routes";

let routes: Routes = [
  ...PagesRoutes,
  {
    path: '**',
    redirectTo: '/'    
  }
];

export const AppRouts = routes;