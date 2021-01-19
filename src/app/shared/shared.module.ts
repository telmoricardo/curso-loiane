import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampoControlErroComponent } from './campo-control-erro/campo-control-erro.component';
import { FormularioDebugComponent } from './formulario-debug/formulario-debug.component';
import { DropdownService } from './services/dropdown.service';



@NgModule({
  declarations: [
    FormularioDebugComponent,
    CampoControlErroComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports:[
    FormularioDebugComponent,
    CampoControlErroComponent
  ]
})
export class SharedModule { }
