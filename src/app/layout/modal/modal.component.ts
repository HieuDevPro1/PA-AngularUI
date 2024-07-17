import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ProductsService } from '../../services/products/products.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnChanges {
  @Input() action: string = '';
  @Input() product: any = {};
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  insertFrm!: FormGroup;
  categories: string[] = ['Iphone', 'Samsung', 'Oppo', 'Xiaomi', "newCategory"];
  showNewCategoryInput = false;

  constructor(private fb: FormBuilder, private service: ProductsService, private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    this.initializeForm();
    // Load initial product data if available
    if (this.product) {
      this.updateFormValues(this.product);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && changes['product'].currentValue) {
      this.updateFormValues(changes['product'].currentValue);
    }
  }

  initializeForm() {
    this.insertFrm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      inventory: ['', Validators.required],
      price: ['', Validators.required],
      discount: [''],
      sold: [''],
      description: [''],
      newCategory: ['']
    });
 
    this.insertFrm.valueChanges.subscribe(form => {
      if (form.price) {
        const formattedPrice = this.currencyPipe.transform(form.price.replace(/\D/g, '').replace(/^0+/, ''), 'VND', 'symbol', '1.0-0');
        this.insertFrm.patchValue({
          price: formattedPrice
        }, { emitEvent: false });
      }
    });
  }

  updateFormValues(product: any) {
    if (this.insertFrm) {
      const formattedPrice = this.currencyPipe.transform(String(product.price).replace(/\D/g, '').replace(/^0+/, ''), 'VND', 'symbol', '1.0-0');
      console.log(formattedPrice)
      this.insertFrm.patchValue({
        name: product.name || '',
        category: product.category || '',
        inventory: product.inventory || '',
        price: formattedPrice || '',
        discount: product.discount || '',
        sold: product.sold || '',
        description: product.description || '',
        newCategory: ''
      });
      this.showNewCategoryInput = product.category === 'newCategory';
    }
  }

  onCategoryChange() {
    const selectedCategory = this.insertFrm.get('category')?.value;
    this.showNewCategoryInput = selectedCategory === 'newCategory';
    if (!this.showNewCategoryInput) {
      this.insertFrm.patchValue({ newCategory: '' });
    }
  }

  onSubmit() {
    if (this.insertFrm.valid) {
      // const formData = this.insertFrm.value;
      let formData = { ...this.insertFrm.value };
      formData.price = parseInt(formData.price.replace(/[^0-9]/g, ''), 10);
      if (this.showNewCategoryInput && formData.newCategory) {
        formData.category = formData.newCategory;
      }
      delete formData.newCategory;
      if (this.action === 'add') {
        this.service.insertProduct(formData).subscribe({
          next: (response) => {
            console.log('Product inserted successfully', response);
            this.closeModal.emit();
            setTimeout(() => {
              alert('Product inserted successfully');
            }, 500)  
          },
          error: (err) => {
            console.error('Error inserting product', err),
            setTimeout(() => {
              alert('Error inserting product')
            }, 500)
          }
        });
      } else if (this.action === 'update') {
        const productId = this.product._id;
        this.service.updateProduct(productId, formData).subscribe({
          next: (response) => {
            console.log('Product updated successfully', response);
            this.closeModal.emit();
            setTimeout(() => {
              alert('Product updated successfully')
            }, 500)
          },
          error: (err) => {
            console.error('Error updating product', err),
            setTimeout(() => {
              alert('Error updating product')
            }, 500)
          }
        });
      }
    }
  }
}
