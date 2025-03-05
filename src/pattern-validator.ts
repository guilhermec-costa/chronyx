export class PatternValidator {
  
  public validate(expr: string): boolean{
    try {
      return true;
    } catch (_) {
      return false;
    }
  }
}
