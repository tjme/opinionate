import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingChangesGuard } from './pending-changes.guard';

import { AccountclosingListComponent } from './list/accountclosing.type';
import { AccountclosingComponent } from './crud/accountclosing.type';
import { CatastrophetypeListComponent } from './list/catastrophetype.type';
import { CatastrophetypeComponent } from './crud/catastrophetype.type';
import { ClaimListComponent } from './list/claim.type';
import { ClaimComponent } from './crud/claim.type';
import { PolicyListComponent } from './list/policy.type';
import { PolicyComponent } from './crud/policy.type';
import { PolicytypeListComponent } from './list/policytype.type';
import { PolicytypeComponent } from './crud/policytype.type';
import { PolicystatusListComponent } from './list/policystatus.type';
import { PolicystatusComponent } from './crud/policystatus.type';
import { PremiumtypeListComponent } from './list/premiumtype.type';
import { PremiumtypeComponent } from './crud/premiumtype.type';
import { PeriodtypeListComponent } from './list/periodtype.type';
import { PeriodtypeComponent } from './crud/periodtype.type';
import { CurrencyListComponent } from './list/currency.type';
import { CurrencyComponent } from './crud/currency.type';
import { LedgerListComponent } from './list/ledger.type';
import { LedgerComponent } from './crud/ledger.type';
import { DebitnoteListComponent } from './list/debitnote.type';
import { DebitnoteComponent } from './crud/debitnote.type';
import { ContactListComponent } from './list/contact.type';
import { ContactComponent } from './crud/contact.type';
import { PolicysplitListComponent } from './list/policysplit.type';
import { PolicysplitComponent } from './crud/policysplit.type';
import { SplittypeListComponent } from './list/splittype.type';
import { SplittypeComponent } from './crud/splittype.type';
import { PolicyconditionListComponent } from './list/policycondition.type';
import { PolicyconditionComponent } from './crud/policycondition.type';
import { VehiclemakeListComponent } from './list/vehiclemake.type';
import { VehiclemakeComponent } from './crud/vehiclemake.type';
import { ClaimconditionListComponent } from './list/claimcondition.type';
import { ClaimconditionComponent } from './crud/claimcondition.type';
import { PaymentListComponent } from './list/payment.type';
import { PaymentComponent } from './crud/payment.type';
import { StatementListComponent } from './list/statement.type';
import { StatementComponent } from './crud/statement.type';
import { StatementdebitnoteListComponent } from './list/statementdebitnote.type';
import { StatementdebitnoteComponent } from './crud/statementdebitnote.type';
import { RelationListComponent } from './list/relation.type';
import { RelationComponent } from './crud/relation.type';
import { TransactionListComponent } from './list/transaction.type';
import { TransactionComponent } from './crud/transaction.type';
import { PolicyriListComponent } from './list/policyri.type';
import { PolicyriComponent } from './crud/policyri.type';
import { ClaimstatustypeListComponent } from './list/claimstatustype.type';
import { ClaimstatustypeComponent } from './crud/claimstatustype.type';
import { ClaimreservehistoryListComponent } from './list/claimreservehistory.type';
import { ClaimreservehistoryComponent } from './crud/claimreservehistory.type';
import { CommodityListComponent } from './list/commodity.type';
import { CommodityComponent } from './crud/commodity.type';
import { ContactproductListComponent } from './list/contactproduct.type';
import { ContactproductComponent } from './crud/contactproduct.type';
import { ConveyancetypeListComponent } from './list/conveyancetype.type';
import { ConveyancetypeComponent } from './crud/conveyancetype.type';
import { CorrespondenceListComponent } from './list/correspondence.type';
import { CorrespondenceComponent } from './crud/correspondence.type';
import { CountryListComponent } from './list/country.type';
import { CountryComponent } from './crud/country.type';
import { FormattypeListComponent } from './list/formattype.type';
import { FormattypeComponent } from './crud/formattype.type';
import { GoodsconditionListComponent } from './list/goodscondition.type';
import { GoodsconditionComponent } from './crud/goodscondition.type';
import { NamedconditionListComponent } from './list/namedcondition.type';
import { NamedconditionComponent } from './crud/namedcondition.type';
import { NumberListComponent } from './list/number.type';
import { NumberComponent } from './crud/number.type';
import { RegletterListComponent } from './list/regletter.type';
import { RegletterComponent } from './crud/regletter.type';
import { ReportoptionListComponent } from './list/reportoption.type';
import { ReportoptionComponent } from './crud/reportoption.type';
import { StatspremiumtypeListComponent } from './list/statspremiumtype.type';
import { StatspremiumtypeComponent } from './crud/statspremiumtype.type';
import { StatsyearListComponent } from './list/statsyear.type';
import { StatsyearComponent } from './crud/statsyear.type';
import { SubstitutioncodeListComponent } from './list/substitutioncode.type';
import { SubstitutioncodeComponent } from './crud/substitutioncode.type';
import { VoyageListComponent } from './list/voyage.type';
import { VoyageComponent } from './crud/voyage.type';
import { VoyagetypeListComponent } from './list/voyagetype.type';
import { VoyagetypeComponent } from './crud/voyagetype.type';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},

  {path: 'accountclosing/list', component: AccountclosingListComponent},
  {path: 'accountclosing', component: AccountclosingComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'accountclosing/:id', component: AccountclosingComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'catastrophetype/list', component: CatastrophetypeListComponent},
  {path: 'catastrophetype', component: CatastrophetypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'catastrophetype/:id', component: CatastrophetypeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'claim/list', component: ClaimListComponent},
  {path: 'claim', component: ClaimComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'claim/:id', component: ClaimComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'policy/list', component: PolicyListComponent},
  {path: 'policy', component: PolicyComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'policy/:id', component: PolicyComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'policytype/list', component: PolicytypeListComponent},
  {path: 'policytype', component: PolicytypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'policytype/:id', component: PolicytypeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'policystatus/list', component: PolicystatusListComponent},
  {path: 'policystatus', component: PolicystatusComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'policystatus/:id', component: PolicystatusComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'premiumtype/list', component: PremiumtypeListComponent},
  {path: 'premiumtype', component: PremiumtypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'premiumtype/:id', component: PremiumtypeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'periodtype/list', component: PeriodtypeListComponent},
  {path: 'periodtype', component: PeriodtypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'periodtype/:id', component: PeriodtypeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'currency/list', component: CurrencyListComponent},
  {path: 'currency', component: CurrencyComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'currency/:id', component: CurrencyComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'ledger/list', component: LedgerListComponent},
  {path: 'ledger', component: LedgerComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'ledger/:id', component: LedgerComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'debitnote/list', component: DebitnoteListComponent},
  {path: 'debitnote', component: DebitnoteComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'debitnote/:id', component: DebitnoteComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'contact/list', component: ContactListComponent},
  {path: 'contact', component: ContactComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'contact/:id', component: ContactComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'policysplit/list', component: PolicysplitListComponent},
  {path: 'policysplit', component: PolicysplitComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'policysplit/:id', component: PolicysplitComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'splittype/list', component: SplittypeListComponent},
  {path: 'splittype', component: SplittypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'splittype/:id', component: SplittypeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'policycondition/list', component: PolicyconditionListComponent},
  {path: 'policycondition', component: PolicyconditionComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'policycondition/:id', component: PolicyconditionComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'vehiclemake/list', component: VehiclemakeListComponent},
  {path: 'vehiclemake', component: VehiclemakeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'vehiclemake/:id', component: VehiclemakeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'claimcondition/list', component: ClaimconditionListComponent},
  {path: 'claimcondition', component: ClaimconditionComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'claimcondition/:id', component: ClaimconditionComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'payment/list', component: PaymentListComponent},
  {path: 'payment', component: PaymentComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'payment/:id', component: PaymentComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'statement/list', component: StatementListComponent},
  {path: 'statement', component: StatementComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'statement/:id', component: StatementComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'statementdebitnote/list', component: StatementdebitnoteListComponent},
  {path: 'statementdebitnote', component: StatementdebitnoteComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'statementdebitnote/:id', component: StatementdebitnoteComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'relation/list', component: RelationListComponent},
  {path: 'relation', component: RelationComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'relation/:id', component: RelationComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'transaction/list', component: TransactionListComponent},
  {path: 'transaction', component: TransactionComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'transaction/:id', component: TransactionComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'policyri/list', component: PolicyriListComponent},
  {path: 'policyri', component: PolicyriComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'policyri/:id', component: PolicyriComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'claimstatustype/list', component: ClaimstatustypeListComponent},
  {path: 'claimstatustype', component: ClaimstatustypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'claimstatustype/:id', component: ClaimstatustypeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'claimreservehistory/list', component: ClaimreservehistoryListComponent},
  {path: 'claimreservehistory', component: ClaimreservehistoryComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'claimreservehistory/:id', component: ClaimreservehistoryComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'commodity/list', component: CommodityListComponent},
  {path: 'commodity', component: CommodityComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'commodity/:id', component: CommodityComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'contactproduct/list', component: ContactproductListComponent},
  {path: 'contactproduct', component: ContactproductComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'contactproduct/:id', component: ContactproductComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'conveyancetype/list', component: ConveyancetypeListComponent},
  {path: 'conveyancetype', component: ConveyancetypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'conveyancetype/:id', component: ConveyancetypeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'correspondence/list', component: CorrespondenceListComponent},
  {path: 'correspondence', component: CorrespondenceComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'correspondence/:id', component: CorrespondenceComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'country/list', component: CountryListComponent},
  {path: 'country', component: CountryComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'country/:id', component: CountryComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'formattype/list', component: FormattypeListComponent},
  {path: 'formattype', component: FormattypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'formattype/:id', component: FormattypeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'goodscondition/list', component: GoodsconditionListComponent},
  {path: 'goodscondition', component: GoodsconditionComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'goodscondition/:id', component: GoodsconditionComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'namedcondition/list', component: NamedconditionListComponent},
  {path: 'namedcondition', component: NamedconditionComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'namedcondition/:id', component: NamedconditionComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'number/list', component: NumberListComponent},
  {path: 'number', component: NumberComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'number/:id', component: NumberComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'regletter/list', component: RegletterListComponent},
  {path: 'regletter', component: RegletterComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'regletter/:id', component: RegletterComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'reportoption/list', component: ReportoptionListComponent},
  {path: 'reportoption', component: ReportoptionComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'reportoption/:id', component: ReportoptionComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'statspremiumtype/list', component: StatspremiumtypeListComponent},
  {path: 'statspremiumtype', component: StatspremiumtypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'statspremiumtype/:id', component: StatspremiumtypeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'statsyear/list', component: StatsyearListComponent},
  {path: 'statsyear', component: StatsyearComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'statsyear/:id', component: StatsyearComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'substitutioncode/list', component: SubstitutioncodeListComponent},
  {path: 'substitutioncode', component: SubstitutioncodeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'substitutioncode/:id', component: SubstitutioncodeComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'voyage/list', component: VoyageListComponent},
  {path: 'voyage', component: VoyageComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'voyage/:id', component: VoyageComponent, canDeactivate: [PendingChangesGuard]},

  {path: 'voyagetype/list', component: VoyagetypeListComponent},
  {path: 'voyagetype', component: VoyagetypeComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'voyagetype/:id', component: VoyagetypeComponent, canDeactivate: [PendingChangesGuard]},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
