import { Component } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { CommonModule } from '@angular/common';
import { AlertRESService } from '../../core/services/alertRES/alert-res.service';
import { ModalAlertService } from '../../core/services/alert/modal-alert.service';
import { ModalNewCategoryService } from '../../core/services/modalNewCategory/modal-new-category.service';

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export default class CategoriesComponent {
  public gastos: any;
  public ingresos: any;

  constructor(
    public categoriesSrv : CategoriesService,
    public alert: ModalAlertService,
    public alertRES : AlertRESService,
    public categorySrv : ModalNewCategoryService,
  ){
    this.getCategories()  
  }

  getCategories(){
    this.categoriesSrv.getCategoriesByUserId().subscribe({
      next: (data) =>{
        if (data !== null) {
          this.gastos = data
            .filter((data:any) => data.type === 'Gasto')
            .map((data:any) => {
              const blob = this.base64ToBlob(data.image, 'image/jpeg');
              return {
                id: data.id,
                name: data.name,
                image: URL.createObjectURL(blob),
                type: data.type,
              }
            })

          this.ingresos = data
            .filter((data:any) => data.type === 'Ingreso')
            .map((data:any) => {
            const blob = this.base64ToBlob(data.image, 'image/jpeg');
            return {
              id: data.id,
              name: data.name,
              image: URL.createObjectURL(blob),
              type: data.type,
            }
          })
          console.log(data)
          console.log("Gastos",this.gastos)
          console.log("ingresos",this.ingresos)
        }
      }
    })
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArray], { type: mimeType });
  }

  editTrans(categoryId:number) {
    
  }

  deleteBtn(categoryId:number) {
    this.alertRES.openCustomDialog('Advertencia', '¿Está seguro que desea eliminar la categoría?')
      .subscribe((result: boolean) => {
        if (result) {
          //console.log('Transacción eliminada');
          this.delete(categoryId);
          
        } 
      });
  }

  delete(id: number): void {
    this.categoriesSrv.deleteCategory(id).subscribe({
      next: () => {
        this.alert.openCustomDialog('Éxito', 'La categoría ha sido eliminada éxitosamente. :)', 'success');
  
        // Eliminar la categoría de la lista de gastos o ingresos localmente
        this.gastos = this.gastos.filter((category: any) => category.id !== id);
        this.ingresos = this.ingresos.filter((category: any) => category.id !== id);
      },
      error: (error) => {
        this.alert.openCustomDialog('Error', error, 'error');
      }
    });
  }
  
  newCategory(){
    this.categorySrv.openModal();
    this.getCategories();
  }
}
