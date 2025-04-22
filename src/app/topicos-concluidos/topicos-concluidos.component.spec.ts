/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TopicosConcluidosComponent } from './topicos-concluidos.component';

describe('TopicosConcluidosComponent', () => {
  let component: TopicosConcluidosComponent;
  let fixture: ComponentFixture<TopicosConcluidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicosConcluidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicosConcluidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
