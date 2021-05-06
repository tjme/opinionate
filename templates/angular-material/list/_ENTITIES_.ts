${!entity.meta.templates.includes("list") ? "" : `
import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton  } from '@angular/material/button';
import { MatCheckbox  } from '@angular/material/checkbox';
import { MatDialog  } from '@angular/material/dialog';
import { MatFormField  } from '@angular/material/form-field';
import { MatIcon  } from '@angular/material/icon';
import { MatPaginator  } from '@angular/material/paginator';
import { MatSort  } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInput  } from '@angular/material/input';
import { MatTooltip  } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GraphQLService } from '../graphql.service';
import gql from 'graphql-tag';
import { ${entity.name}, ${entity.name}Patch } from '../../../../models/types';

const ${entity.name}Fields = gql\`fragment ${entity.name}Fields on ${entity.name} { nodeId,${entity.fields
  .filter(f => isField(f) && f.meta.templates.includes("list")).map(fields => `${fields.name}`)} }\`;
const ReadAll = gql\`query readAll{all${plural(entity.name)}
  {nodes{...${entity.name}Fields } } } $\{ ${entity.name}Fields}\`;
// const Delete = gql\`mutation delete($nodeId:ID!)
//   {delete${entity.name}(input:{nodeId:$nodeId})
//   { ${entity.name.toLowerCase()}{...${entity.name}Fields } } } $\{ ${entity.name}Fields}\`;

@Component({
  selector: 'app-${entity.name.toLowerCase()}-list',
  templateUrl: './${entity.name.toLowerCase()}.html',
  styleUrls: ['./list.css']
})
export class ${entity.name}ListComponent implements OnInit, AfterViewInit {
  displayedColumns = [${entity.fields
    .filter(f => isField(f) && f.meta.templates.includes("list")).map(fields => `"${fields.name}"`)}];
  dataSource = new MatTableDataSource<${entity.name}>();
  dialogResult: any;
  // @ViewChild('${entity.name}Table') ${entity.name}Table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dlgSv: MatDialog,
    private gqlSv: GraphQLService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.readAll();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  readAll(): void {
    this.gqlSv.query<{all${plural(entity.name)}: {nodes: ${entity.name}[]}}>(ReadAll).pipe(
      map((_) => _.all${plural(entity.name)}.nodes)).subscribe(_ => this.dataSource.data = _);
  }

  goto(row: string): void {
    this.router.navigate(['/${entity.name.toLowerCase()}/' + row]);
  }

  // delete(${entity.name.toLowerCase()}: ${entity.name}): void {
  //   if (confirm('Are you sure you want to delete this record?')) {
  //     this.gqlSv.mutate<{delete${entity.name}: { ${entity.name.toLowerCase()}: ${entity.name} }}>
  //       (Delete, ${entity.name.toLowerCase()}, 'delete').pipe(
  //       map((_) => _.delete${entity.name}.${entity.name.toLowerCase()})).subscribe();
  //     this.dataSource.data = this.dataSource.data.filter(_ => _.nodeId !== ${entity.name.toLowerCase()}.nodeId);
  //   }
  // }
}`}
