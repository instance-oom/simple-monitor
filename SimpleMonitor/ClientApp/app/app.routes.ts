import { Routes, RouterModule } from '@angular/router';

import { RootLayoutPage, HomePage, GroupPage } from './pages';

let routes: Routes = [
  {
    path: '', component: RootLayoutPage, children: [
      { path: '', component: HomePage },
      { path: 'groups/:groupId/overview', component: GroupPage }
    ]
  }
]

export const AppRouting = RouterModule.forRoot(routes, { useHash: false });