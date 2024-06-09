import TableDataGrid from "../../core/datagrid/TableDataGrid";
import Navbar from "../../core/navbar/Navbar";
import Sidebar from "../../core/sidebar/Sidebar";

import { Outlet, Link } from "react-router-dom";
import { RegisterUser } from "../Users/Register/RegisterUser";

const testJson = `[
   {
      "Estado ":"Aceptada",
      "Referencia":"00012024051711074636877661",
      "Fecha Registro ":"2024-05-17T11:37:46.841438",
      "Monto":"868.85",
      "Moneda":"VES",
      "Fecha Instrucción":"2024-05-17",
      "Iniciador":"",
      "Canal ":"0040",
      "Producto":"040",
      "Sub Producto":"223",
      "Banco Emisor ":"0001",
      "Cuenta Emisor":"00010001380100018503",
      "Id. Emisor":"J77822180",
      "Nombre Emisor":"Nom Deudor 77822180",
      "Id. Último Emisor":"",
      "Nombre Último Emisor":"",
      "Concepto ":"CONCEPTO CREDITO",
      "Banco Receptor":"0115",
      "Cuenta Receptor":"01151780239290295633",
      "Id. Receptor":"J52229941",
      "Nombre Receptor":"Nom Acreedor 52229941",
      "Tlf./Alias Receptor":null,
      "Id Último Receptor":"",
      "Nombre Último Receptor":"",
      "Fecha Liquidación":"2024-05-17",
      "Corte":"2",
      "Rechazo ":null,
      "Descripción Rechazo":null,
      "Originador":null,
      "Estatus Entrega Banco":"Entregado",
      "Contrato y Factura":null,
      "Contrato y Factura JSON":null
   },
   {
      "Estado ":"Aceptada",
      "Referencia":"00012024051812015119584411",
      "Fecha Registro ":"2024-05-18T12:31:51.786137",
      "Monto":"730.23",
      "Moneda":"VES",
      "Fecha Instrucción":"2024-05-18",
      "Iniciador":"",
      "Canal ":"0040",
      "Producto":"040",
      "Sub Producto":"229",
      "Banco Emisor ":"0001",
      "Cuenta Emisor":"00010001380100012789",
      "Id. Emisor":"J83031220",
      "Nombre Emisor":"Nom Deudor 83031220",
      "Id. Último Emisor":"",
      "Nombre Último Emisor":"",
      "Concepto ":"CONCEPTO CREDITO",
      "Banco Receptor":"0151",
      "Cuenta Receptor":"01515402314680638397",
      "Id. Receptor":"J23139688",
      "Nombre Receptor":"Nom Acreedor 23139688",
      "Tlf./Alias Receptor":null,
      "Id Último Receptor":"",
      "Nombre Último Receptor":"",
      "Fecha Liquidación":"2024-05-17",
      "Corte":"2",
      "Rechazo ":null,
      "Descripción Rechazo":null,
      "Originador":null,
      "Estatus Entrega Banco":"Entregado",
      "Contrato y Factura":null,
      "Contrato y Factura JSON":null
   },
   {
      "Estado ":"Rechazada",
      "Referencia":"00012024051710234342220155",
      "Fecha Registro ":"2024-05-17T10:23:42.056555",
      "Monto":"659.19",
      "Moneda":"VES",
      "Fecha Instrucción":"2024-05-17",
      "Iniciador":"",
      "Canal ":"0040",
      "Producto":"040",
      "Sub Producto":"224",
      "Banco Emisor ":"0001",
      "Cuenta Emisor":"00010001380100015419",
      "Id. Emisor":"J08101420",
      "Nombre Emisor":"Nom Deudor 08101420",
      "Id. Último Emisor":"",
      "Nombre Último Emisor":"",
      "Concepto ":"CONCEPTO CREDITO",
      "Banco Receptor":"0166",
      "Cuenta Receptor":"01661986543103617311",
      "Id. Receptor":"J01911873",
      "Nombre Receptor":"Nom Acreedor 01911873",
      "Tlf./Alias Receptor":null,
      "Id Último Receptor":"",
      "Nombre Último Receptor":"",
      "Fecha Liquidación":"2024-05-17",
      "Corte":"2",
      "Rechazo ":"VE01",
      "Descripción Rechazo":"Rechazo técnico ",
      "Originador":"SIMF",
      "Estatus Entrega Banco":"Entregado",
      "Contrato y Factura":null,
      "Contrato y Factura JSON":null
   },
   {
      "Estado ":"Aceptada",
      "Referencia":"00012024051710350055176484",
      "Fecha Registro ":"2024-05-17T10:35:54.925605",
      "Monto":"531.75",
      "Moneda":"VES",
      "Fecha Instrucción":"2024-05-17",
      "Iniciador":"",
      "Canal ":"0040",
      "Producto":"040",
      "Sub Producto":"220",
      "Banco Emisor ":"0001",
      "Cuenta Emisor":"00010001380100016570",
      "Id. Emisor":"J147546331",
      "Nombre Emisor":"Graham and Sons",
      "Id. Último Emisor":"",
      "Nombre Último Emisor":"",
      "Concepto ":"CONCEPTO CREDITO",
      "Banco Receptor":"0171",
      "Cuenta Receptor":"01711773934668060370",
      "Id. Receptor":"J842392553",
      "Nombre Receptor":"Boyle-Johnson",
      "Tlf./Alias Receptor":null,
      "Id Último Receptor":"",
      "Nombre Último Receptor":"",
      "Fecha Liquidación":"2024-05-17",
      "Corte":"2",
      "Rechazo ":null,
      "Descripción Rechazo":null,
      "Originador":null,
      "Estatus Entrega Banco":"Entregado",
      "Contrato y Factura":null,
      "Contrato y Factura JSON":null
   },
   {
      "Estado ":"Aceptada",
      "Referencia":"00012024051710254683815845",
      "Fecha Registro ":"2024-05-17T10:55:46.868278",
      "Monto":"895.85",
      "Moneda":"VES",
      "Fecha Instrucción":"2024-05-17",
      "Iniciador":"",
      "Canal ":"0040",
      "Producto":"040",
      "Sub Producto":"222",
      "Banco Emisor ":"0001",
      "Cuenta Emisor":"00010001380100010889",
      "Id. Emisor":"J93656794",
      "Nombre Emisor":"Nom Deudor 93656794",
      "Id. Último Emisor":"",
      "Nombre Último Emisor":"",
      "Concepto ":"CONCEPTO CREDITO",
      "Banco Receptor":"0138",
      "Cuenta Receptor":"01385143456088685206",
      "Id. Receptor":"J14233937",
      "Nombre Receptor":"Nom Acreedor 14233937",
      "Tlf./Alias Receptor":null,
      "Id Último Receptor":"",
      "Nombre Último Receptor":"",
      "Fecha Liquidación":"2024-05-17",
      "Corte":"2",
      "Rechazo ":null,
      "Descripción Rechazo":null,
      "Originador":null,
      "Estatus Entrega Banco":"Entregado",
      "Contrato y Factura":null,
      "Contrato y Factura JSON":null
   }
]`


export default function MainLayout({ }) {


   return (
      <>
         <div className='flex h-screen overflow-hidden'>
            <Sidebar />
            <Navbar>
               <TableDataGrid data={testJson} />
               {/* <RegisterUser></RegisterUser> */}
            </Navbar>
         </div>
         <div id="modal-root"></div>

      </>



   )
}