import { Route } from '@angular/router';
import { userGuard } from 'app/guard/auth/user-guard';

interface RouterAlias extends Route {
  alias?: string;
  children?: RouterAlias[];
}
const routes: RouterAlias[] = [
  {
    path: 'home',
    children: [
      {
        path: 'login',
        async loadComponent() {
          return (await import('@page/auth-form/login.component')).AuthFormComponent;
        },
        'alias':'login'
      },
      {
        path:'main-chat',
        loadComponent: async () => (await import('@page/main-chat/main-chat.component')).MainChatComponent,
        alias:'main-chat',
        canActivate:[userGuard]
      }
    ]
  },
  {path:'**',
    redirectTo:'/home/login'
  }
];
export { RouterAlias, routes };

