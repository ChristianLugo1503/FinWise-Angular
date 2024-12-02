import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { TransactionsService } from '../../../core/services/transactions/transactions.service';
import { ModalAlertService } from '../../../core/services/alert/modal-alert.service';

@Component({
    selector: 'app-modal-add-transaction',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './modal-add-transaction.component.html',
    styleUrl: './modal-add-transaction.component.css'
})
export class ModalAddTransactionComponent implements OnInit{
  private modalAlertSrv = inject(ModalAlertService);
  categories: { id: number, name: string, image: Blob , type: string}[] = [];

  //MODAL
  constructor(
    public dialogRef: MatDialogRef<ModalAddTransactionComponent>,
    private categorieSrv: CategoriesService,
    private transactionSrv: TransactionsService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }

  ) {}

  ngOnInit(): void {
    this.categorieSrv.getUserData().subscribe(data => {
      console.log('Categorias del usuario cargadas desde el modal', data);
      this.categories = data.map((category: { id: number, name: any; image: any; type: any }) => {
        const blob = this.base64ToBlob(category.image, 'image/jpeg');
        return {
          id: category.id,
          name: category.name,
          image: URL.createObjectURL(blob),
          type: category.type,
        }
      });
      console.log('ngonit',this.categories)
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

  selectCategory(categoryName: number): void {
    console.log('Categoría seleccionada:', categoryName);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  //FORMULARIO
  form = signal<FormGroup>(
    new FormGroup({
      amount: new FormControl(0, [
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
      ]),
      categoryID: new FormControl('',[
        Validators.required
      ]),
      date: new FormControl('',[
        Validators.required
      ]),
      description: new FormControl('',[
        Validators.required
      ]),
      userId: new FormControl(''),
      type: new FormControl('')
    })
  );

  //ENVIAR FORMULARIO A LA API
  sendForm() {
    this.form().patchValue({ userId: this.getUserId() }); //asignar el user id al formulario
    this.form().patchValue({ type: this.data.title});
    this.transactionSrv.createTransaction(this.form().value).subscribe({
      next: (response) => {
        this.closeModal();
        this.modalAlertSrv.openCustomDialog('Éxito','Transacción añadida con éxito','success');
        console.log(response);
      },
      error: (err) => {
        console.error(err);
        this.modalAlertSrv.openCustomDialog('Error',err,'error');
      }
    });
  }

  //Optener Id de LocalStorage
  getUserId(): any{
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.id;
    return userId;
  }


  //VALIDACIONES FORMULARIO
  checkMount(){
    const control = this.form().get('amount');
    if(control?.hasError('required') && control.touched){
      return 'Monto requerido'
    }else if (control?.hasError('pattern')){
      return 'Solo se admiten números enteros y dos decimales despúes del punto.'
    }else if (control?.value === 0 && control.touched) {
      return 'El valor del monto no puede ser 0.'
      //seria mejor un alert
    }
    else {
      return '';
    }
  }

  checkCategory() {
    const control = this.form().get('categoryID');
    if (control?.hasError('required') && control.touched) {
      return 'Categoría requerida';
    }
    return '';
  }

  checkDate() {
    const control = this.form().get('date');
    if (control?.hasError('required') && control.touched) {
      return 'Fecha requerida';
    }
    return '';
  }

  hasRequiredError(fiel:string):boolean{
    const control = this.form().get(fiel);
    if(control?.hasError('required') && control.touched){
      return true
    }else{

      return false
    }
  }

}
