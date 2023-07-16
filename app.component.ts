import {Component} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


export interface Item {
  detalle: String,
  cantidad: number,
  valorUnitario: number,
  valorTotal: number,

}

export interface Cliente {
  nombre: String,
  direccion: String,
  telefono: String,
  objetos: Array<Item>,
}

export interface Boleta {
  fecha: String,
  cliente: Cliente,
  metodoDePago: String,
  metodoDeEnvio: String,
  total: String,

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  total = 0;

  cliente: Cliente = {
    direccion: "",
    nombre: "",
    telefono: "",
    objetos: []
  };

  metodoDePago = "";
  metodoDeEnvio = "";

  items: Array<Item> = [];

  constructor(private http: HttpClient) {
    this.sumarItem()
  }

  downloadPdfMake() {

    this.cliente.objetos = this.items;

    let boleta: Boleta = {
      cliente: this.cliente,
      fecha: new Date().toString(),
      total: this.total.toString(),
      metodoDeEnvio: this.metodoDeEnvio,
      metodoDePago: this.metodoDePago
    };

    // playground requires you to assign document definition to a variable called dd
    // playground requires you to assign document definition to a variable called dd


    console.log(boleta.cliente.objetos.map(o => {
      return [o.detalle, o.cantidad, o.valorUnitario, o.valorTotal]
    }));

    var dd = {


      //watermark: { text: '@malibuu_storee2', angle: 70 },

      content: [
        {
          image: environment.logoRedondo,
          width: 500,
          height: 500,
          margin: 10,
          absolutePosition: {x: 50, y: 200}

        },
        {
          text: 'Detalle de compra', alignment: 'center', margin: [0, 70, 0, 0], fontSize: 42
          , decoration: "underline", bold: true
        },


        {text: new Date().toLocaleDateString('en-ZA'), absolutePosition: {x: 485, y: 30}, fontSize: 15}
        ,
        {
          image: environment.igLogo,
          width: 30,
          height: 30,
          margin: 10,
          absolutePosition: {x: 80, y: 40}

        },
        {
          color: "blue",
          text: '@malibuu_storee2',
          fontSize: 25,
          absolutePosition: {x: 120, y: 40},
          link: "https://instagram.com/malibuu_storee2"
        }
        ,

        {
          columns: [

            {
              bold:true,
              color:"#343434",
              width: 90,
              text: 'Nombre:  ', fontSize: 20
            },
            {
              text: boleta.cliente.nombre, fontSize: 17
            }
          ]
        }
        ,
        {
          columns: [
            {
              bold:true,
              color:"#343434",
              width: 90,
              text: 'Dirección:  ', fontSize: 20
            },
            {
              text: boleta.cliente.direccion, fontSize: 17
            }
          ]

        },

        {
          columns: [
            {
              bold:true,
              color:"#343434",
              width: 90,
              text: 'Telefono:  ', fontSize: 20
            },
            {
              text: boleta.cliente.telefono, fontSize: 17
            }
          ]

        }

        ,
        {

          columns: [
            {
              text: 'Metodo de envio:  ' + boleta.metodoDeEnvio, fontSize: 20
            }
            ,
            {
              text: 'Metodo de pago:  ' + boleta.metodoDePago, fontSize: 20
            }
          ]
        },
        {width: '*', text: ''},

        {
          fontSize: 19,
          width: 'auto',
          table: {
            widths: ['60%', '*', '*', '*'],
            body: [
              [{text: 'Detalle', bold: true, fontSize: 20},
                {text: 'Cantidad', bold: true, fontSize: 20},
                {text: 'V. unitario', bold: true, fontSize: 20}
                , {text: 'Valor total', bold: true, fontSize: 20}
              ],
              ...boleta.cliente.objetos.map(o => {
                return [o.detalle, o.cantidad, o.valorUnitario, o.valorTotal]
              }),
            ]
          },
          margin: [0, 10]
        },
        {width: '*', text: ''},
        {
          text: "Total: $" + boleta.total, fontSize: 20
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      background: function () {
        return {
          canvas: [
            {
              type: 'rect',
              x: 0, y: 0, w: 595.28, h: 841.89,
              color: "#e4bcfd"
            }
          ]
        };
      }
      ,
      defaultStyle: {
        // alignment: 'justify'
        font: "Roboto"
      }

    }

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.vfs.fonts = {
      Roboto: {
        normal: 'https://fonts.cdnfonts.com/s/21864/MutterKrauseNormal.woff',
        bold: 'https://fonts.cdnfonts.com/s/21864/MutterKrauseHalbfett.woff',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      }

    }

    pdfMake.createPdf(dd, null, pdfMake.vfs.fonts).download("boleta" + boleta.cliente.nombre + boleta.cliente.telefono + ".pdf");
  }

  descargarPDFHttp() {

    this.cliente.objetos = this.items;
    let boleta: Boleta = {
      cliente: this.cliente,
      fecha: new Date().toString(),
      total: this.total.toString(),
      metodoDeEnvio: this.metodoDeEnvio,
      metodoDePago: this.metodoDePago
    };

    this.http.post("http://localhost:5000", boleta, {responseType: "blob"}).subscribe((data: Blob) => {
      let file = new Blob([data], {type: 'application/pdf'});
      console.log(data);
      let fileURL = URL.createObjectURL(file);

      //window.open(fileURL);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'bill.pdf';
      document.body.appendChild(a);
      a.click();
      console.log(fileURL);
    })
  }


  sumarItem() {
    let newItem: Item = {
      detalle: "",
      valorUnitario: undefined,
      cantidad: undefined,
      valorTotal: undefined
    };
    this.items.push(newItem)
  }

  sumarTotal() {
    let total = 0;
    for (let it of this.items) {
      try {
        total = +it.valorTotal + +total
      } catch (e) {
        console.log(e);
      }
    }
    this.total = total;
  }

  sumarTotalItem(i) {
    this.items[i].valorTotal = this.items[i].cantidad * this.items[i].valorUnitario
    this.sumarTotal()

  }


  borrar(i) {
    let nuevaLista = [];
    for (let it = 0; it < this.items.length; it++) {
      if (it == i) {

      } else {
        nuevaLista.push(this.items[it])
      }
    }
    this.items = nuevaLista

  }

}
