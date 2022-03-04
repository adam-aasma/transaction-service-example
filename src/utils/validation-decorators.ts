import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDateString(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          'Date must match format yyyy-mm-dd and be in range 2020-01-01, today',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex =
            /^[2-9](0[2-9]|[1-9]\d)\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/;
          if (!regex.test(value)) return false;

          const [year, month, day] = value
            .split('-')
            .map((v: string) => Number(v));

          if (month === 2) {
            if (year % 4) {
              if (day > 28) return false;
            } else {
              if (day > 29) return false;
            }
          }
          if ([4, 6, 9, 11].includes(month)) {
            if (day > 30) return false;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const givenDate = new Date(value);

          return givenDate <= today;
        },
      },
    });
  };
}

export function IsPositiveNumberString(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPositiveNumberString',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Must be a positive number string',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return Number(value) >= 0;
        },
      },
    });
  };
}

export function IsCurrencyAlpha3Code(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isCurrencyAlpha3Code',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Currency must be 3 ASCII characters ',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return /^[a-zA-Z]{3}$/.test(value);
        },
      },
      
    });
  };
}
