import { Routes, RouterModule } from '@angular/router';
import { LayoutPage } from './layout';
import { HomePage } from './home';
import { GroupHomePage } from './group';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: LayoutPage,
    children: [
      {
        path: '',
        component: HomePage
      },
      {
        path: 'groups/:groupId/overview',
        component: GroupHomePage
      }
    ]
  }
]