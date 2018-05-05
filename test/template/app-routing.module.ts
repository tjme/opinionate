import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingChangesGuard } from './pending-changes.guard';
${OVERLAY}
import { ${types.name}ListComponent } from './list/${types.name.toLowerCase()}.type';
import { ${types.name}Component } from './crud/${types.name.toLowerCase()}.type';${}

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
${OVERLAY}
  {path: '${types.name.toLowerCase()}/list', component: ${types.name}ListComponent},
  {path: '${types.name.toLowerCase()}', component: ${types.name}Component, canDeactivate: [PendingChangesGuard]},
  {path: '${types.name.toLowerCase()}/:id', component: ${types.name}Component, canDeactivate: [PendingChangesGuard]},${}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
