import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConcluidoComponent } from './chat-concluido.component';

describe('ChatConcluidoComponent', () => {
  let component: ChatConcluidoComponent;
  let fixture: ComponentFixture<ChatConcluidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatConcluidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatConcluidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
