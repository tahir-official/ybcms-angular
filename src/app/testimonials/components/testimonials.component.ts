import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestimonialService } from '../services/testimonial.service';
import { Testimonial } from '../models/testimonial.model';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [];
  categories: Category[] = [];
  langcode = 'en';
  category = '';

  loading = false;

  constructor(private service: TestimonialService) {}

  async ngOnInit() {
    this.categories = await this.service.fetchCategories(this.langcode);
    await this.loadTestimonials();
  }

  async loadTestimonials() {
    this.loading = true;
    this.testimonials = await this.service.fetchTestimonials(this.langcode, this.category);
    this.loading = false;
  }

  async onFilterChange() {
    await this.loadTestimonials();
  }
}
