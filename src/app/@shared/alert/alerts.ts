import { EMAIL_PATTERN } from '@core/constants/regex';
import Swal from 'sweetalert2';
import { TYPE_ALERT } from './values.config';

const swalWithBasicOptions = (title: string, html: string) => Swal.mixin({
  title,
  html,
  focusConfirm: false,
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Cancelar',
  showCancelButton: true,
});

// export async function formBasicDialog(title: string, html: string, property: string) {
//   return await swalWithBasicOptions(title, html).fire({
//     preConfirm: () => {
//       const value = ((document.getElementById('name')) as HTMLInputElement).value;
//       if (value) {
//         return value;
//       }
//       Swal.showValidationMessage('Tienes que escribir un grupo para poder agregarlo');
//       return;
//     }
//   });
// }

// export async function userFormsBasicDialog(title: string, html: string) {
//   return await swalWithBasicOptions(title, html).fire({
//     preConfirm: () => {
//       let error = '';
//       const name = ((document.getElementById('name')) as HTMLInputElement).value;
//       if (!name) {
//         error += 'Usuario es obligatorio<br/>';
//       }
//       const lastname = ((document.getElementById('lastname')) as HTMLInputElement).value;
//       if (!lastname) {
//         error += 'Apellido es obligatorio<br/>';
//       }
//       const email = ((document.getElementById('email')) as HTMLInputElement).value;
//       if (!email) {
//         error += 'Correo electronico es obligatorio<br/>';
//       }
//       if (!EMAIL_PATTERN.test(email)) {
//         error += 'Correo electronico no es correcto en su formato<br/>';
//       }
//       const role = ((document.getElementById('role')) as HTMLInputElement).value;
//       if (!role) {
//         error += 'Role es obligatorio';
//       }
//       if (error !== '') {
//         Swal.showValidationMessage(error);
//         return;
//       }
//       return {
//         name,
//         lastname,
//         email,
//         role,
//       };
//     }
//   });
// }

// export async function sellerFormsBasicDialog(title: string, html: string) {
//   return await swalWithBasicOptions(title, html).fire({
//     preConfirm: () => {
//       let error = '';
//       const name = ((document.getElementById('name')) as HTMLInputElement).value;
//       if (!name) {
//         error += 'Usuario es obligatorio<br/>';
//       }
//       const lastname = ((document.getElementById('lastname')) as HTMLInputElement).value;
//       if (!lastname) {
//         error += 'Apellido es obligatorio<br/>';
//       }
//       if (error !== '') {
//         Swal.showValidationMessage(error);
//         return;
//       }
//       return {
//         name,
//         lastname
//       };
//     }
//   });
// }

// export async function clientFormsBasicDialog(title: string, html: string) {
//   return await swalWithBasicOptions(title, html).fire({
//     preConfirm: () => {
//       let error = '';
//       const name = ((document.getElementById('name')) as HTMLInputElement).value;
//       if (!name) {
//         error += 'Usuario es obligatorio<br/>';
//       }
//       const lastname = ((document.getElementById('lastname')) as HTMLInputElement).value;
//       if (!lastname) {
//         error += 'Apellido es obligatorio<br/>';
//       }
//       const rfc = ((document.getElementById('rfc')) as HTMLInputElement).value;
//       const telefono = ((document.getElementById('telefono')) as HTMLInputElement).value;
//       if (error !== '') {
//         Swal.showValidationMessage(error);
//         return;
//       }
//       return {
//         name,
//         lastname,
//         rfc,
//         telefono,
//         registerDate: new Date().toISOString()
//       };
//     }
//   });
// }

// export async function shopProductFormsBasicDialog(title: string, html: string) {
//   return await swalWithBasicOptions(title, html).fire({
//     preConfirm: () => {
//       let error = '';
//       const product_id = ((document.getElementById('product_id')) as HTMLInputElement).value;
//       if (!product_id) {
//         error += 'El producto es obligatorio<br/>';
//       }
//       const branch_office_id = ((document.getElementById('branch_office_id')) as HTMLInputElement).value;
//       if (!branch_office_id) {
//         error += 'La sucursal es obligatoria<br/>';
//       }
//       const price = parseFloat(((document.getElementById('price')) as HTMLInputElement).value);

//       const stock = parseFloat(((document.getElementById('stock')) as HTMLInputElement).value);

//       const active = true;

//       if (error !== '') {
//         Swal.showValidationMessage(error);
//         return;
//       }
//       return {
//         product_id,
//         branch_office_id,
//         price,
//         stock,
//         active,
//         registerDate: new Date().toISOString()
//       };
//     }
//   });
// }

// export async function productFormsBasicDialog(title: string, html: string) {
//   return await swalWithBasicOptions(title, html).fire({
//     preConfirm: () => {
//       let error = '';
//       const name = ((document.getElementById('name')) as HTMLInputElement).value;
//       if (!name) {
//         error += 'El nombre es obligatorio<br/>';
//       }
//       const description = ((document.getElementById('description')) as HTMLInputElement).value;
//       if (!description) {
//         error += 'La descripcion es obligatoria<br/>';
//       }
//       const price = parseFloat(((document.getElementById('price')) as HTMLInputElement).value);

//       const qty = parseFloat(((document.getElementById('qty')) as HTMLInputElement).value);

//       const img = ((document.getElementById('img')) as HTMLInputElement).value;

//       if (error !== '') {
//         Swal.showValidationMessage(error);
//         return;
//       }
//       return {
//         name,
//         description,
//         price,
//         qty,
//         registerDate: new Date().toISOString(),
//         img
//       };
//     }
//   });
// }

// export async function optionsWithDetails(title: string, html: string, width: number | string, confirmButtonText: string = '',
// cancelButtonText: string = '') {
//   return await Swal.fire({
//     title,
//     html,
//     width: `${width}px`,
//     showCloseButton: true,
//     showCancelButton: true,
//     confirmButtonColor: '#6c757d',
//     cancelButtonColor: '#dc3545',
//     confirmButtonText,
//     cancelButtonText
//   }).then((result) => {
//     if (result.value) {
//       console.log('Editar');
//       return true;
//     } else if (result.dismiss.toString() === 'cancel') {
//       console.log('Bloqueado');
//       return false;
//     }
//   });
// }

export const loadData = (title: string, html: string) => {
  Swal.fire({
    title,
    html,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });
};

export const closeAlert = () => {
  Swal.close();
};

export const infoEventAlert = async (title: string, html: string, typeAlert: TYPE_ALERT = TYPE_ALERT.WARNING) => {
  return await Swal.fire({
    title,
    html,
    icon: typeAlert,
    preConfirm: () => {
      return true;
    }
  });
};
