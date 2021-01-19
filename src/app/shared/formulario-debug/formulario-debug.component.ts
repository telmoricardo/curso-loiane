import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario-debug',
  templateUrl: './formulario-debug.component.html',
  styleUrls: ['./formulario-debug.component.css']
})
export class FormularioDebugComponent implements OnInit {

  @Input() form;
  
  constructor() { }

  ngOnInit(): void {
  }

}
