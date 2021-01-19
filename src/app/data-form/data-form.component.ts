import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EstadoBr } from '../shared/models/estado-br';
import { DropdownService } from '../shared/services/dropdown.service';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';


@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;
  estados: EstadoBr[];

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService:  DropdownService,
    private cepService: ConsultaCepService) { }

  ngOnInit(): void {

    /* this.formulario = new FormGroup({
     nome: new FormControl(null),
       email: new FormControl(null),
     });*/

     this.dropdownService.getEstados().subscribe(dados =>{
       this.estados = dados
       console.info(this.estados);
     });


    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
  }

  onSubmit(){
    console.log(this.formulario);

    if(this.formulario.valid) {
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .pipe(map(res => res))
      .subscribe(res=> {
        console.info(res);
        //reseta o formulario
        //this.resetar();
      },(error: any) => alert('erro'));
    } else {
      console.info('formulario invalido');
      // Object.keys(this.formulario.controls).forEach(campo => {
      //   console.info(campo);
      //   const controle = this.formulario.get(campo);
      //   controle.markAsTouched();

      // });
      this.verificaValidacoesForm(this.formulario);
    }

  }

  verificaValidacoesForm(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(campo => {
      console.info(campo);
      const controle = formGroup.get(campo);
      controle.markAsTouched();

      if(controle instanceof FormGroup){
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar(){
    this.formulario.reset();
  }

  verificaValidTouched(campo){
    return !this.formulario.get(campo).valid && (this.formulario.get(campo).touched || this.formulario.get(campo).dirty);
  }

  aplicaCssErro(campo){
    return {
      'is-invalid': this.verificaValidTouched(campo)

    }
  }

  verificaEmailInvalido(){
    let campoEmail = this.formulario.get('email');
    if(campoEmail.errors){
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  consultaCEP(){

    const cep = this.formulario.get('endereco.cep').value;

    if(cep != null && cep !== ''){
      this.cepService.consultaCEP(cep).subscribe(dados=> this.popularDadosForm(dados));
    }
  }

  resetaDadosForm(){
    this.formulario.patchValue({
      endereco: {
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  popularDadosForm(dados){
    /*formulario.setValue({
      nome: formulario.value.nome,
      email: formulario.value.email,
      endereco: {
        cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });*/
    this.formulario.patchValue({
      endereco: {
        //cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }
}
