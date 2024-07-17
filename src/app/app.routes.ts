import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { TablesComponent } from './layout/tables/tables.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { ChartComponent } from './layout/chart/chart.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: MainComponent, 
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'table', component: TablesComponent },
            { path: 'chart', component: ChartComponent }
        ]
    },
    { path: 'create-account', component: CreateAccountComponent },
    { path: '**', component: LoginComponent}

    // { path: '**', redirectTo: "login", pathMatch: "full"},
];
