import { Component, OnInit } from '@angular/core';
import { TopicosComponent } from '../topicos/topicos.component';

@Component({
  selector: 'app-topicos-concluidos',
  templateUrl: './topicos-concluidos.component.html',
  styleUrls: ['./topicos-concluidos.component.css'],
  imports: [TopicosComponent]
})
export class TopicosConcluidosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
