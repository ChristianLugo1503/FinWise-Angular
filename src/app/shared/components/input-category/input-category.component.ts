import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CategoriesService } from '../../../core/services/categories/api/categories.service';

@Component({
  selector: 'app-input-category',
  imports: [CommonModule],
  templateUrl: './input-category.component.html',
  styleUrl: './input-category.component.css',
})
export class InputCategoryComponent implements OnChanges {
  @Input() type!: string; // Recibe el tipo de categoría
  @Input() defaultCategory!: number; // Recibe la categoría por defecto
  @Output() categoryID = new EventEmitter<number>(); // Envía el ID de la categoría seleccionada

  public categoryid!: number; // ID de la categoría seleccionada
  public categories: any = []; // Lista de categorías disponibles

  constructor(private categorieSrv: CategoriesService) {
    this.categorieSrv.getCategoriesByUserId().subscribe();
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultCategory'] && this.defaultCategory) {
      this.selectCategory(this.defaultCategory);
    }
  }

  selectCategory(categoryID: number): void {
    this.categoryid = categoryID;
    this.categoryID.emit(categoryID);
    console.log('Categoría seleccionada:', categoryID);
  }

  loadCategories(): void {
    this.categorieSrv.getCategoriesData().subscribe((data) => {
      if (data !== null) {
        this.categories = data
          .filter((category: { type: any }) => category.type === this.type)
          .map((category: any) => {
            if (category.image && !category.image.startsWith('blob:')) {
              const blob = this.base64ToBlob(category.image, 'image/jpeg');
              category.image = URL.createObjectURL(blob) || null;
            }
            return category;
          });
      }
    });
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArray], { type: mimeType });
  }
}
