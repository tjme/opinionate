${!types.meta.crud ? "" : `
import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckbox, MatButton, MatIcon, MatTooltip, MatInput, MatFormField, MatDatepicker, MatDatepickerToggle } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { GraphQLService } from '../graphql.service';
import gql from 'graphql-tag';
import { ComponentCanDeactivate } from '../pending-changes.guard';
import { ${types.name}, ${types.name}Patch } from '../../models/types';

const ${types.name}Fields = gql\`fragment ${types.name.toLowerCase()}Fields on ${types.name} { nodeId,${types.fields
  .filter(f => isField(f) && f.meta.crud).map(fields => `${fields.name}`)} }\`;
const Read = gql\`query read($nodeId:ID!){ ${types.name.toLowerCase()}(nodeId:$nodeId)
  {...${types.name.toLowerCase()}Fields } } $\{ ${types.name}Fields}\`;
const Create = gql\`mutation create(${types.fields
  .filter(f => isField(f) && f.meta.crud && f.meta.crud).map(fields => `$${fields.name}:${fields.type.name}${!fields.hasOwnProperty("isRequired") ? "" : "!"}`)})
  {create${types.name}(input:{
    ${types.name.toLowerCase()}:{ ${types.fields
      .filter(f => isField(f) && f.meta.crud).map(fields => `${fields.name}:\$${fields.type.name}`)} } })
  { ${types.name.toLowerCase()}{...${types.name.toLowerCase()}Fields } } } $\{ ${types.name}Fields}\`;
const Update = gql\`mutation update($nodeId:ID!,${types.fields
  .filter(f => isField(f) && f.meta.crud).map(fields => `$${fields.name}:${fields.type.name}`)})
  {update${types.name}(input:{nodeId:$nodeId,
  ${types.name.toLowerCase()}Patch:{ ${types.fields
    .filter(f => isField(f) && f.meta.crud).map(fields => `${fields.name}:\$${fields.type.name}`)} } })
  { ${types.name.toLowerCase()}{...${types.name.toLowerCase()}Fields } } } $\{ ${types.name}Fields}\`;
const Delete = gql\`mutation delete($nodeId:ID!)
  {delete${types.name}(input:{nodeId:$nodeId})
  { ${types.name.toLowerCase()}{...${types.name.toLowerCase()}Fields } } } $\{ ${types.name}Fields}\`;

@Component({
  selector: 'app-${types.name.toLowerCase()}',
  templateUrl: './${types.name.toLowerCase()}.html',
  styleUrls: ['./crud.css']
})
export class ${types.name}Component implements OnInit, ComponentCanDeactivate  {
  @Input() ${types.name.toLowerCase()} = {} as ${types.name};
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
      this.gqlSv.query<{ ${types.name.toLowerCase()}: ${types.name} }>
        (Read, {'nodeId': this.route.snapshot.paramMap.get('id')}).pipe(
        map((_) => _.${types.name.toLowerCase()})).subscribe(_ => this.${types.name.toLowerCase()} = _); }
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
      this.gqlSv.mutate<{update${types.name}: { ${types.name.toLowerCase()}: ${types.name} } }>
        (Update, this.${types.name.toLowerCase()}, 'update').pipe(
        map((_) => _.update${types.name}.${types.name.toLowerCase()})).subscribe(() => this.back());
    } else {
      const result = this.gqlSv.mutate<{create${types.name}: { ${types.name.toLowerCase()}: ${types.name} } }>
        (Create, this.${types.name.toLowerCase()}, 'create').pipe(
        map((_) => _.create${types.name}.${types.name.toLowerCase()})).subscribe(() => this.back());
    }
  }

  delete(): void {
    this.allowDeactivate = true;
    if (this.route.snapshot.paramMap.get('id') !== null) {
      if (confirm('Are you sure you want to delete this record?')) {
        this.gqlSv.mutate<{delete${types.name}: { ${types.name.toLowerCase()}: ${types.name} } }>
          (Delete, this.${types.name.toLowerCase()}, 'delete').pipe(
          map((_) => _.delete${types.name}.${types.name.toLowerCase()})).subscribe(() => this.back());
      }
    }
  }
}`}
