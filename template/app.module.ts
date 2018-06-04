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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { AppRoutingModule } from './app-routing.module';
import { PendingChangesGuard } from './pending-changes.guard';
import { AppComponent } from './app.component';
import { GraphQLService } from './graphql.service';
import { DashboardComponent } from './dashboard/dashboard.component';
${types.map(types => `
${!types.meta.templates.includes("crud") ? "" : `import { ${types.name}Component } from './crud/${types.name.toLowerCase()}';`}
${!types.meta.templates.includes("list") ? "" : `import { ${types.name}ListComponent } from './list/${types.name.toLowerCase()}';`}`).join("\n")}

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
${types.map(types => `
${!types.meta.templates.includes("crud") ? "" : `    ${types.name}Component,`}
${!types.meta.templates.includes("list") ? "" : `    ${types.name}ListComponent,`}`).join("\n")}
  ],
  providers: [
    GraphQLService,
    PendingChangesGuard,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
