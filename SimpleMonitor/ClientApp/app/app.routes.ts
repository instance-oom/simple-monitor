import { Routes, RouterModule } from '@angular/router';

import { RootLayoutPage } from './pages';

let routes: Routes = [
  { path: '', component: RootLayoutPage }
]

export const AppRouting = RouterModule.forRoot(routes, { useHash: false });