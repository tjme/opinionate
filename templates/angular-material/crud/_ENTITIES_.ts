${!entity.meta.templates.includes("crud") ? "" : `
import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButton  } from '@angular/material/button';
import { MatCheckbox  } from '@angular/material/checkbox';
import { MatDatepicker  } from '@angular/material/datepicker';
import { MatFormField  } from '@angular/material/form-field';
import { MatIcon  } from '@angular/material/icon';
import { MatInput  } from '@angular/material/input';
import { MatTooltip  } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GraphQLService } from '../graphql.service';
import gql from 'graphql-tag';
import { ComponentCanDeactivate } from '../pending-changes.guard';
import { ${entity.name}, ${entity.name}Patch } from '../../../../models/types';

const ${entity.name}Fields = gql\`fragment ${entity.name}Fields on ${entity.name} { nodeId,${entity.fields
  .filter(f => isField(f) && f.meta.templates.includes("crud")).map(fields => `${fields.name}`)} }\`;
const Read = gql\`query read($nodeId:ID!){ ${entity.name.toLowerCase()}(nodeId:$nodeId)
  {...${entity.name}Fields } } $\{ ${entity.name}Fields}\`;
const Create = gql\`mutation create(${entity.fields
  .filter(f => isField(f) && f.meta.templates.includes("crud") && f.meta.templates.includes("crud")).map(fields => `$${fields.name}:${getType(fields)}${!fields.hasOwnProperty("isRequired") ? "!" : ""}`)})
  {create${entity.name}(input:{
    ${entity.name.toLowerCase()}:{ ${entity.fields
      .filter(f => isField(f) && f.meta.templates.includes("crud")).map(fields => `${fields.name}:\$${fields.name}`)} } })
  { ${entity.name.toLowerCase()}{...${entity.name}Fields } } } $\{ ${entity.name}Fields}\`;
const Update = gql\`mutation update($nodeId:ID!,${entity.fields
  .filter(f => isField(f) && f.meta.templates.includes("crud")).map(fields => `$${fields.name}:${getType(fields)}`)})
  {update${entity.name}(input:{nodeId:$nodeId,
  ${entity.name.toLowerCase()}Patch:{ ${entity.fields
    .filter(f => isField(f) && f.meta.templates.includes("crud")).map(fields => `${fields.name}:\$${fields.name}`)} } })
  { ${entity.name.toLowerCase()}{...${entity.name}Fields } } } $\{ ${entity.name}Fields}\`;
const Delete = gql\`mutation delete($nodeId:ID!)
  {delete${entity.name}(input:{nodeId:$nodeId})
  { ${entity.name.toLowerCase()}{...${entity.name}Fields } } } $\{ ${entity.name}Fields}\`;

@Component({
  selector: 'app-${entity.name.toLowerCase()}',
  templateUrl: './${entity.name.toLowerCase()}.html',
  styleUrls: ['./crud.css']
})
export class ${entity.name}Component implements OnInit, ComponentCanDeactivate  {
  @Input() ${entity.name.toLowerCase()} = {} as ${entity.name};
  @ViewChild('crudForm') crudForm: FormGroup;
  private allowDeactivate: boolean;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private gqlSv: GraphQLService,
  ) {}

  ngOnInit(): void {
    this.allowDeactivate = false;
    if (this.route.snapshot.paramMap.get('id') !== null) {
      this.gqlSv.query<{ ${entity.name.toLowerCase()}: ${entity.name} }>
        (Read, {'nodeId': this.route.snapshot.paramMap.get('id')}).pipe(
        map((_) => _.${entity.name.toLowerCase()})).subscribe(_ => this.${entity.name.toLowerCase()} = _); }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.allowDeactivate) { this.allowDeactivate = false; return true; }
    return !this.crudForm.dirty;
  }

  back(): void {
    this.location.back();
  }

  save(): void {
    this.allowDeactivate = true;
    if (this.route.snapshot.paramMap.get('id') !== null) {
      this.gqlSv.mutate<{update${entity.name}: { ${entity.name.toLowerCase()}: ${entity.name} } }>
        (Update, this.${entity.name.toLowerCase()}, 'update').pipe(
        map((_) => _.update${entity.name}.${entity.name.toLowerCase()})).subscribe(() => this.back());
    } else {
      const result = this.gqlSv.mutate<{create${entity.name}: { ${entity.name.toLowerCase()}: ${entity.name} } }>
        (Create, this.${entity.name.toLowerCase()}, 'create').pipe(
        map((_) => _.create${entity.name}.${entity.name.toLowerCase()})).subscribe(() => this.back());
    }
  }

  delete(): void {
    this.allowDeactivate = true;
    if (this.route.snapshot.paramMap.get('id') !== null) {
      if (confirm('Are you sure you want to delete this record?')) {
        this.gqlSv.mutate<{delete${entity.name}: { ${entity.name.toLowerCase()}: ${entity.name} } }>
          (Delete, this.${entity.name.toLowerCase()}, 'delete').pipe(
          map((_) => _.delete${entity.name}.${entity.name.toLowerCase()})).subscribe(() => this.back());
      }
    }
  }
}`}
