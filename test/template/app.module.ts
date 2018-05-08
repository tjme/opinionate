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
${overlay.map(types => `
import { ${types.name}Component } from './crud/${types.name.toLowerCase()}';
import { ${types.name}ListComponent } from './list/${types.name.toLowerCase()}';`).join("\n")}

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
${overlay.map(types => `
    ${types.name}Component,
    ${types.name}ListComponent,`).join("\n")}
  ],
  providers: [
    GraphQLService,
    PendingChangesGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
