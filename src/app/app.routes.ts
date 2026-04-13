import { Route } from '@angular/router';

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
        'alias':'loginPage'
      }
    ]
  }
];
export { RouterAlias, routes };

