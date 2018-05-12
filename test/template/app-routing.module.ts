import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingChangesGuard } from './pending-changes.guard';
${types.map(types => `
${!types.meta.crud ? "" : `import { ${types.name}Component } from './crud/${types.name.toLowerCase()}';`}
${!types.meta.list ? "" : `import { ${types.name}ListComponent } from './list/${types.name.toLowerCase()}';`}`).join("\n")}

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
${types.map(types => `
${!types.meta.list ? "" : `  {path: '${types.name.toLowerCase()}/list', component: ${types.name}ListComponent},`}
${!types.meta.crud ? "" : `  {path: '${types.name.toLowerCase()}', component: ${types.name}Component, canDeactivate: [PendingChangesGuard]},
  {path: '${types.name.toLowerCase()}/:id', component: ${types.name}Component, canDeactivate: [PendingChangesGuard]},`}`).join("\n")}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
