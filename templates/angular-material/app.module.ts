import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { AppRoutingModule } from './app-routing.module';
import { PendingChangesGuard } from './pending-changes.guard';
import { AppComponent } from './app.component';
import { GraphQLService } from './graphql.service';
import { DashboardComponent } from './dashboard/dashboard.component';
${entities.map(entity => `
${!entity.meta.templates.includes("crud") ? "" : `import { ${entity.name}Component } from './crud/${entity.name.toLowerCase()}';`}
${!entity.meta.templates.includes("list") ? "" : `import { ${entity.name}ListComponent } from './list/${entity.name.toLowerCase()}';`}`).join("\n")}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
${entities.map(entity => `
${!entity.meta.templates.includes("crud") ? "" : `    ${entity.name}Component,`}
${!entity.meta.templates.includes("list") ? "" : `    ${entity.name}ListComponent,`}`).join("\n")}
  ],
  providers: [
    GraphQLService,
    PendingChangesGuard,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
