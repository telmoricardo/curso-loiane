import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null,
    cep:null,
    numero: null,
    complemento: null,
    rua: null,
    bairro: null,
    cidade: null,
    estado: null
  }
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  verificaValidTouched(campo){
    return !campo.valid && campo.touched;
  }

  aplicaCssErro(campo){ 
    return {
      'is-invalid': this.verificaValidTouched(campo)
      
    }
  }

  consultaCEP(cep, form){
    //Nova variável "cep" somente com dígitos.
    var cep = cep.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if(validacep.test(cep)) {

          this.resetaDadosForm(form);

          this.http.get(`https://viacep.com.br/ws/${cep}/json`)
          .subscribe(dados => {
            console.log(dados);
            if(dados != null){
              this.popularDadosForm(dados, form);
            }else {
              this.resetaDadosForm(form);
              alert('CEP NÃO ENCONTRADO!')
            }
          });      
      }else {
        this.resetaDadosForm(form);
        alert('CEP NÃO ENCONTRADO!')
      }

    }
  }

  popularDadosForm(dados, formulario){
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
    formulario.form.patchValue({
      endereco: {
        cep: dados.cep,       
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  resetaDadosForm(formulario){
    formulario.form.patchValue({
      endereco: {
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  onSubmit(form){
    console.log(form);
    
    //console.log(form.value);

    //console.log(this.usuario);
    this.http.post('https://httpbin.org/post', JSON.stringify(form.value))
    .subscribe(res=> {
      console.info(res);
    });
  }
  

}
