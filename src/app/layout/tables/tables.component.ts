import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule, ModalComponent],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
})
export class TablesComponent implements OnInit {
  title = 'tables';
  productList!: Product[];
  filterProductList!: Product[];
  showModal = false;
  modalAction = '';
  selectedProduct!: Product ;
  showDeleteModal = false;
  
  selectedCategory: string = '';
  selectedInventoryRange = { min: 0, max: Number.MAX_VALUE };
  selectedPriceRange = { min: 0, max: Number.MAX_VALUE };
  selectedDiscountRange = { min: 0, max: Number.MAX_VALUE };
  selectedSoldRange = { min: 0, max: Number.MAX_VALUE };
  readonly maxNumberValue = Number.MAX_VALUE;

  config: any = {
    itemsPerPage: 4,
    currentPage: 1,
    totalItems: 0,
  };

  constructor(private service: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.service.getProducts().subscribe((products) => {
      this.productList = products;
      this.config.totalItems = this.productList.length;
      this.filterProductList = this.productList;
    });
  }

  pageChanged(event: any): void {
    this.config.currentPage = event;
  }
  openModal(action: string, product?: Product): void {
    this.modalAction = action;
    
    if (action === 'add') {
      this.selectedProduct = new Product(); // Clear data
    } else if (action === 'update' && product) {
      
      this.selectedProduct = { ...product };
    }
      this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.loadProducts();
  }

  deleteProduct(id: string): void {
    this.service.deleteProduct(id).subscribe({
      next: () => {
        setTimeout(() => {
          this.loadProducts(),
          alert('Product deleted successfully')
        }, 500)
      },
      error: (err) => {
        setTimeout(() => {
          console.error('Error deleting product', err),
          alert('Error deleting product')
        }, 500)
      }
    });
  }

  getProgressBarClass(inventory: number | undefined): string {
    if (inventory === undefined) {
      return 'bg-secondary'; // Default class when inventory is undefined
    } else if (inventory <= 25) {
      return 'bg-danger'; 
    } else if (inventory <= 70) {
      return 'bg-warning';
    } else {
      return 'bg-success';
    }
  }
  
  getSoldPercentage(sold: number | undefined): number {
    if (sold === undefined) {
      return 0;
    }
    return ((sold - 500) / 500) * 100;
  }
  
  getSoldClassAndIcon(sold: number | undefined): { class: string, icon: string } {
    if (sold === undefined || sold < 500) {
      return { class: 'text-danger', icon: 'mdi-arrow-down' };
    } else {
      return { class: 'text-success', icon: 'mdi-arrow-up' };
    }
  }

  search(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase().trim();
    
    this.filterProductList = this.productList.filter((product: any) =>
      Object.keys(product).some(key =>
        ['name', 'category', 'inventory', 'price', 'discount', 'sold', 'description'].includes(key) &&
        (typeof product[key] === 'string' || product[key] instanceof String ?
          product[key].toLowerCase().includes(input) :
          typeof product[key] === 'number' && product[key].toString().includes(input)
        )
      )
    );
    this.config.totalItems = this.filterProductList.length;
    this.config.currentPage = 1;
  }  

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  filterByInventoryRange(min: number, max: number): void {
    this.selectedInventoryRange = { min, max };
    // this.selectedPriceRange = { min: 0, max: this.maxNumberValue };
    // this.selectedDiscountRange = { min: 0, max: this.maxNumberValue };
    // this.selectedSoldRange = { min: 0, max: this.maxNumberValue };
    this.applyFilters();
  }

  filterByPriceRange(min: number, max: number): void {
    this.selectedPriceRange = { min, max };
    this.applyFilters();
  }

  filterByDiscountRange(min: number, max: number): void {
    this.selectedDiscountRange = { min, max };
    this.applyFilters();
  }

  filterBySoldRange(min: number, max: number): void {
    this.selectedSoldRange = { min, max };
    this.applyFilters();
  }

  applyFilters(): void {
    this.filterProductList = this.productList.filter(product => {
      const matchesCategory = this.selectedCategory ? product.category?.toLowerCase() === this.selectedCategory.toLowerCase() : true;
      const matchesInventory = (product.inventory ?? 0) >= this.selectedInventoryRange.min && (product.inventory ?? 0) <= this.selectedInventoryRange.max;
      const matchesPrice = (product.price ?? 0) >= this.selectedPriceRange.min && (product.price ?? 0) <= this.selectedPriceRange.max;
      const matchesDiscount = (product.discount ?? 0) >= this.selectedDiscountRange.min && (product.discount ?? 0) <= this.selectedDiscountRange.max;
      const matchesSold = (product.sold ?? 0) >= this.selectedSoldRange.min && (product.sold ?? 0) <= this.selectedSoldRange.max;
  
      return matchesCategory && matchesInventory && matchesPrice && matchesDiscount && matchesSold;
    });
  
    this.config.totalItems = this.filterProductList.length;
    this.config.currentPage = 1;
  }
  
  
 
}
