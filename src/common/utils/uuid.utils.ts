import { v4 as uuidv4, validate as validateUUID } from 'uuid';

export class UUID {
  static generate(): string {
    return uuidv4();
  }

  static validate(id: string): boolean {
    return validateUUID(id);
  }

  static validateOrThrow(id: string): void {
    if (!this.validate(id)) {
      throw new Error(`Invalid UUID: ${id}`);
    }
  }
}
