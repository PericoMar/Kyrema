import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  // Validador personalizado para el nombre de usuario único
  static userNameNotTaken(existingUsernames: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const username = control.value;
      if (existingUsernames.includes(username)) {
        return { userNameTaken: true }; // Si el nombre de usuario ya existe
      }
      return null; // Es válido si no está en la lista
    };
  }

  // Validador personalizado para la contraseña robusta
  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

    if (!passwordValid) {
      return { 'passwordInvalid': true };
    }

    return null;
  }
}
