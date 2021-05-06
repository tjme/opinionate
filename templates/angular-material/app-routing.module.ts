import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingChangesGuard } from './pending-changes.guard';
${entities.map(entity => `
${!entity.meta.templates.includes("crud") ? "" : `import { ${entity.name}Component } from './crud/${entity.name.toLowerCase()}';`}
${!entity.meta.templates.includes("list") ? "" : `import { ${entity.name}ListComponent } from './list/${entity.name.toLowerCase()}';`}`).join("\n")}

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
${entities.map(entity => `
${!entity.meta.templates.includes("list") ? "" : `  {path: '${entity.name.toLowerCase()}/list', component: ${entity.name}ListComponent},`}
${!entity.meta.templates.includes("crud") ? "" : `  {path: '${entity.name.toLowerCase()}', component: ${entity.name}Component, canDeactivate: [PendingChangesGuard]},
  {path: '${entity.name.toLowerCase()}/:id', component: ${entity.name}Component, canDeactivate: [PendingChangesGuard]},`}`).join("\n")}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
