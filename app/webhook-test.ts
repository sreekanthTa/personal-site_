// Intentional broken code for webhook testing
// This file contains multiple syntax and type errors to trigger CI/CD checks

export const brokenFunction = () => {
  // Syntax error: missing closing bracket
  const obj = { name: "test" 
  
  // Type error: assignment operator instead of comparison
  if (obj = true) {
    console.log("This is wrong");
  }
  
  // Reference error: undefined variable
  return someUndefinedVariable;
};

// Missing return type
export const anotherBrokenFunction = () => {
  const x: string = 123; // Type error: number assigned to string
  
  // Throw error intentionally
  throw new Error("Webhook test - intentional failure");
};

// Accessing non-existent property
const testObj = { a: 1 };
console.log(testObj.nonExistentProp.deep.nested); // This will fail

// Export incomplete statement
export const incomplete =
