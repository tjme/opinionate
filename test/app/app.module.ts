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

import { AccountclosingComponent } from './crud/accountclosing';
import { AccountclosingListComponent } from './list/accountclosing';
import { CatastrophetypeComponent } from './crud/catastrophetype';
import { CatastrophetypeListComponent } from './list/catastrophetype';
import { ClaimComponent } from './crud/claim';
import { ClaimListComponent } from './list/claim';
import { PolicyComponent } from './crud/policy';
import { PolicyListComponent } from './list/policy';
import { PolicytypeComponent } from './crud/policytype';
import { PolicytypeListComponent } from './list/policytype';
import { PolicystatusComponent } from './crud/policystatus';
import { PolicystatusListComponent } from './list/policystatus';
import { PremiumtypeComponent } from './crud/premiumtype';
import { PremiumtypeListComponent } from './list/premiumtype';
import { PeriodtypeComponent } from './crud/periodtype';
import { PeriodtypeListComponent } from './list/periodtype';
import { CurrencyComponent } from './crud/currency';
import { CurrencyListComponent } from './list/currency';
import { LedgerComponent } from './crud/ledger';
import { LedgerListComponent } from './list/ledger';
import { DebitnoteComponent } from './crud/debitnote';
import { DebitnoteListComponent } from './list/debitnote';
import { ContactComponent } from './crud/contact';
import { ContactListComponent } from './list/contact';
import { PolicysplitComponent } from './crud/policysplit';
import { PolicysplitListComponent } from './list/policysplit';
import { SplittypeComponent } from './crud/splittype';
import { SplittypeListComponent } from './list/splittype';
import { PolicyconditionComponent } from './crud/policycondition';
import { PolicyconditionListComponent } from './list/policycondition';
import { VehiclemakeComponent } from './crud/vehiclemake';
import { VehiclemakeListComponent } from './list/vehiclemake';
import { ClaimconditionComponent } from './crud/claimcondition';
import { ClaimconditionListComponent } from './list/claimcondition';
import { PaymentComponent } from './crud/payment';
import { PaymentListComponent } from './list/payment';
import { StatementComponent } from './crud/statement';
import { StatementListComponent } from './list/statement';
import { StatementdebitnoteComponent } from './crud/statementdebitnote';
import { StatementdebitnoteListComponent } from './list/statementdebitnote';
import { RelationComponent } from './crud/relation';
import { RelationListComponent } from './list/relation';
import { TransactionComponent } from './crud/transaction';
import { TransactionListComponent } from './list/transaction';
import { PolicyriComponent } from './crud/policyri';
import { PolicyriListComponent } from './list/policyri';
import { ClaimstatustypeComponent } from './crud/claimstatustype';
import { ClaimstatustypeListComponent } from './list/claimstatustype';
import { ClaimreservehistoryComponent } from './crud/claimreservehistory';
import { ClaimreservehistoryListComponent } from './list/claimreservehistory';
import { CommodityComponent } from './crud/commodity';
import { CommodityListComponent } from './list/commodity';
import { ContactproductComponent } from './crud/contactproduct';
import { ContactproductListComponent } from './list/contactproduct';
import { ConveyancetypeComponent } from './crud/conveyancetype';
import { ConveyancetypeListComponent } from './list/conveyancetype';
import { CorrespondenceComponent } from './crud/correspondence';
import { CorrespondenceListComponent } from './list/correspondence';
import { CountryComponent } from './crud/country';
import { CountryListComponent } from './list/country';
import { FormattypeComponent } from './crud/formattype';
import { FormattypeListComponent } from './list/formattype';
import { GoodsconditionComponent } from './crud/goodscondition';
import { GoodsconditionListComponent } from './list/goodscondition';
import { NamedconditionComponent } from './crud/namedcondition';
import { NamedconditionListComponent } from './list/namedcondition';
import { NumberComponent } from './crud/number';
import { NumberListComponent } from './list/number';
import { RegletterComponent } from './crud/regletter';
import { RegletterListComponent } from './list/regletter';
import { ReportoptionComponent } from './crud/reportoption';
import { ReportoptionListComponent } from './list/reportoption';
import { StatspremiumtypeComponent } from './crud/statspremiumtype';
import { StatspremiumtypeListComponent } from './list/statspremiumtype';
import { StatsyearComponent } from './crud/statsyear';
import { StatsyearListComponent } from './list/statsyear';
import { SubstitutioncodeComponent } from './crud/substitutioncode';
import { SubstitutioncodeListComponent } from './list/substitutioncode';
import { VoyageComponent } from './crud/voyage';
import { VoyageListComponent } from './list/voyage';
import { VoyagetypeComponent } from './crud/voyagetype';
import { VoyagetypeListComponent } from './list/voyagetype';

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

    AccountclosingComponent,
    AccountclosingListComponent,
    CatastrophetypeComponent,
    CatastrophetypeListComponent,
    ClaimComponent,
    ClaimListComponent,
    PolicyComponent,
    PolicyListComponent,
    PolicytypeComponent,
    PolicytypeListComponent,
    PolicystatusComponent,
    PolicystatusListComponent,
    PremiumtypeComponent,
    PremiumtypeListComponent,
    PeriodtypeComponent,
    PeriodtypeListComponent,
    CurrencyComponent,
    CurrencyListComponent,
    LedgerComponent,
    LedgerListComponent,
    DebitnoteComponent,
    DebitnoteListComponent,
    ContactComponent,
    ContactListComponent,
    PolicysplitComponent,
    PolicysplitListComponent,
    SplittypeComponent,
    SplittypeListComponent,
    PolicyconditionComponent,
    PolicyconditionListComponent,
    VehiclemakeComponent,
    VehiclemakeListComponent,
    ClaimconditionComponent,
    ClaimconditionListComponent,
    PaymentComponent,
    PaymentListComponent,
    StatementComponent,
    StatementListComponent,
    StatementdebitnoteComponent,
    StatementdebitnoteListComponent,
    RelationComponent,
    RelationListComponent,
    TransactionComponent,
    TransactionListComponent,
    PolicyriComponent,
    PolicyriListComponent,
    ClaimstatustypeComponent,
    ClaimstatustypeListComponent,
    ClaimreservehistoryComponent,
    ClaimreservehistoryListComponent,
    CommodityComponent,
    CommodityListComponent,
    ContactproductComponent,
    ContactproductListComponent,
    ConveyancetypeComponent,
    ConveyancetypeListComponent,
    CorrespondenceComponent,
    CorrespondenceListComponent,
    CountryComponent,
    CountryListComponent,
    FormattypeComponent,
    FormattypeListComponent,
    GoodsconditionComponent,
    GoodsconditionListComponent,
    NamedconditionComponent,
    NamedconditionListComponent,
    NumberComponent,
    NumberListComponent,
    RegletterComponent,
    RegletterListComponent,
    ReportoptionComponent,
    ReportoptionListComponent,
    StatspremiumtypeComponent,
    StatspremiumtypeListComponent,
    StatsyearComponent,
    StatsyearListComponent,
    SubstitutioncodeComponent,
    SubstitutioncodeListComponent,
    VoyageComponent,
    VoyageListComponent,
    VoyagetypeComponent,
    VoyagetypeListComponent,
  ],
  providers: [
    GraphQLService,
    PendingChangesGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
