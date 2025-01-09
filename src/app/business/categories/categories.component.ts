import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../core/services/categories/api/categories.service';
import { AlertRESService } from '../../core/services/alerts/alert-res.service';
import { ModalAlertService } from '../../core/services/alerts/modal-alert.service';
import { ModalNewCategoryService } from '../../core/services/categories/modals/modal-new-category.service';
import { ModalEditCategoryService } from '../../core/services/categories/modals/modal-edit-category.service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export default class CategoriesComponent implements OnInit {
  public gastos: any[] = [];
  public ingresos: any[] = [];

  constructor(
    public categoriesSrv: CategoriesService,
    public alert: ModalAlertService,
    public alertRES: AlertRESService,
    public newCategorySrv: ModalNewCategoryService,
    public editCategorySrv: ModalEditCategoryService
  ) {
    this.categoriesSrv.getCategoriesByUserId().subscribe();
  }

  ngOnInit() {
    this.categoriesSrv.getCategoriesData().subscribe({
      next: (data) => {
        if (data !== null) {
          //console.log(data);
          this.gastos = data
            .filter((data: any) => data.type === 'Gasto')
            .map((data: any) => {
              const blob = this.base64ToBlob(data.image, 'image/jpeg');
              return {
                id: data.id,
                name: data.name,
                image: URL.createObjectURL(blob),
                imageBlob: data.image,
                color: data.color,
                type: data.type,
              };
            });

          this.ingresos = data
            .filter((data: any) => data.type === 'Ingreso')
            .map((data: any) => {
              if (data.image && !data.image.startsWith('blob:')) {
                const blob = this.base64ToBlob(data.image, 'image/jpeg');
                data.image = URL.createObjectURL(blob) || null;
              }
              return {
                id: data.id,
                name: data.name,
                image: data.image,
                imageBlob: data.image,
                color: data.color,
                type: data.type,
              };
            });
        }
      },
      error: (err) => console.error('Error al obtener categorías:', err),
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

  deleteBtn(categoryId: number) {
    this.alertRES
      .openCustomDialog(
        'Advertencia',
        '¿Está seguro que desea eliminar la categoría?'
      )
      .subscribe((result: boolean) => {
        if (result) {
          this.categoriesSrv.deleteCategory(categoryId).subscribe({
            next: () => {
              this.alert.openCustomDialog(
                'Éxito',
                'La categoría ha sido eliminada éxitosamente. :)',
                'success'
              );
              console.log(this.gastos, this.ingresos);
            },
            error: (error) => {
              this.alert.openCustomDialog('Error', error, 'error');
            },
          });
        }
      });
  }

  editTrans(categoryId: number) {
    this.editCategorySrv.openModal(categoryId);
  }

  newCategory() {
    this.newCategorySrv.openModal();
  }
}
