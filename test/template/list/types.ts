import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource, MatPaginator, MatSort,
  MatCheckbox, MatButton, MatIcon, MatTooltip, MatInput, MatFormField, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ${types.name}, ${types.name}Patch } from '../../models/types';
import { GraphQLService } from '../graphql.service';
import gql from 'graphql-tag';

const ${types.name}Fields = gql\`fragment ${types.name.toLowerCase()}Fields on ${types.name} { nodeId,${types.fields.map(fields => `${fields.name}`)} }\`;
const ReadAll = gql\`query readAll{all${pluralize(types.name)}
  {nodes{...${types.name.toLowerCase()}Fields } } } $\{ ${types.name}Fields}\`;
// const Delete = gql\`mutation delete($nodeId:ID!)
//   {delete${types.name}(input:{nodeId:$nodeId})
//   { ${types.name.toLowerCase()}{...${types.name.toLowerCase()}Fields } } } $\{ ${types.name}Fields}\`;

@Component({
  selector: 'app-${types.name.toLowerCase()}-list',
  templateUrl: './${types.name.toLowerCase()}.html',
  styleUrls: ['./list.css']
})
export class ${types.name}ListComponent implements OnInit, AfterViewInit {
  displayedColumns = [${types.fields.map(fields => `${fields.name}`)}];
  dataSource = new MatTableDataSource<${types.name}>();
  dialogResult: any;
  // @ViewChild('${types.name}Table') ${types.name}Table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dlgSv: MatDialog,
    private gqlSv: GraphQLService,
    private router: Router
  ) {}

  ngOnInit() {
    this.readAll();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  readAll(): void {
    this.gqlSv.query<{all${pluralize(types.name)}: {nodes: ${types.name}[]}}>(ReadAll).pipe(
      map((_) => _.all${pluralize(types.name)}.nodes)).subscribe(_ => this.dataSource.data = _);
  }

  goto(row: string): void {
    this.router.navigate(['/${types.name.toLowerCase()}/' + row]);
  }

  // delete(${types.name.toLowerCase()}: ${types.name}): void {
  //   if (confirm('Are you sure you want to delete this record?')) {
  //     this.gqlSv.mutate<{delete${types.name}: { ${types.name.toLowerCase()}: ${types.name} }}>
  //       (Delete, ${types.name.toLowerCase()}, 'delete').pipe(
  //       map((_) => _.delete${types.name}.${types.name.toLowerCase()})).subscribe();
  //     this.dataSource.data = this.dataSource.data.filter(_ => _.nodeId !== ${types.name.toLowerCase()}.nodeId);
  //   }
  // }
}