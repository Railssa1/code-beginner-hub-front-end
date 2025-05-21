import { SearchService } from './../../services/search.service';
import { NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgStyle],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.getActualRoute();
  }

  getActualRoute(): string{
    const baseUrl = window.location.href
    const endpoint = baseUrl.split('4200')[1]
    return endpoint
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setSearchTerm(value);
  }
}
