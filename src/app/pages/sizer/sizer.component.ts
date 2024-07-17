import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sizer',
  standalone: true,
  imports: [],
  templateUrl: './sizer.component.html',
  styleUrl: './sizer.component.css',
})
export class SizerComponent implements OnInit {
  constructor() {}
  ngOnInit() {
    this.size = 10;
  }
  @Input() size: number | string = 10;
  @Output() sizeChange = new EventEmitter<number>();
  dec() {
    this.resize(-1);
  }
  inc() {
    this.resize(+1);
  }
  resize(delta: number) {
    this.size = Math.min(40, Math.max(8, +this.size + delta));
    this.sizeChange.emit(this.size);
  }
}
